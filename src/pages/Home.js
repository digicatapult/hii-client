import React, { useMemo, useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import {
  Grid,
  Map,
  AppBar,
  Search,
  Drawer,
  ListCard,
} from '@digicatapult/ui-component-library'

import Dialog from './components/Dialog'
import LogoPNG from '../assets/images/hii-logo.png'
import LogoWebP from '../assets/images/hii-logo.webp'
import geojson from '../assets/hii.json'
// give each feature an id
geojson.features = geojson.features.map((f) => {
  return { ...f, properties: { ...f.properties, id: uuid() } }
})

const HomeBar = styled.picture`
  height: 100%;
  margin-left: 20px;
`

const ListWrapper = styled.div`
  display: grid;
  height: 100%;
  align-content: start;
  gap: 5px;
  font-size: 1em;
  overflow: scroll;
  padding: 5px 0 0 5px;
`

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1rem;
  background: #216968;
`

const FullScreenGrid = styled(Grid)`
  height: 100vh;
  width: 100vw;
  overflow: hidden; //TODO fix map overflow
`

const GetProjectTypeColour = (project) => {
  const colours = {
    'Feasability Study': '#27847A',
    'Funding/Competition': '#80CC72',
    'Testing & certification': '#B6EFA0',
    'Innovation programme': '#DFE667',
    'R&D facility': '#C8B88A',
    'Government strategy': '#F1DDDF',
  }
  return colours[project] ?? '#27847A'
}

const pointColourExpression = [
  'match',
  ['get', 'Project Type'],
  'Feasability Study',
  '#27847A',
  'Funding/Competition',
  '#80CC72',
  'Testing & certification',
  '#B6EFA0',
  'Innovation programme',
  '#DFE667',
  'R&D facility',
  '#C8B88A',
  'Government strategy',
  '#F1DDDF',
  '#27847A',
]

const pointRadiusExpression = [
  'interpolate',
  ['linear'],
  ['zoom'],
  1,
  4,
  10,
  10,
]

export default function Home() {
  const [search, setSearch] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const listWrapperRef = useRef(null)

  const filteredGeoJson = useMemo(() => {
    if (search === null) {
      return geojson
    }

    const { features, ...rest } = geojson
    return {
      ...rest,
      features: features.filter(({ properties }) =>
        Object.values(properties).some(
          (val) => `${val}`.toLowerCase().indexOf(search) !== -1
        )
      ),
    }
  }, [search])

  // scroll to selected feature
  useEffect(() => {
    if (selectedFeature) {
      listWrapperRef.current.children
        .namedItem(selectedFeature.id)
        ?.scrollIntoView({
          behavior: 'smooth',
        })
    }
  }, [selectedFeature])

  // clear selected feature on dialog close
  useEffect(() => {
    if (!showDialog) setSelectedFeature(null)
  }, [showDialog])

  return (
    <FullScreenGrid
      areas={[
        ['home', 'header'],
        ['search', 'main'],
        ['filters', 'main'],
        ['projects', 'main'],
      ]}
      columns={['minmax(min-content, 1fr)', '3fr']}
      rows={['80px', 'min-content', 'min-content', 'minmax(0, 1fr)']}
    >
      <Grid.Panel area="home">
        <HomeBar>
          <source srcSet={LogoWebP} type="image/webp" />
          <source srcSet={LogoPNG} type="image/png" />
          <img src={LogoPNG} alt="HII Initiative Logo" height="80px" />
        </HomeBar>
      </Grid.Panel>
      <Grid.Panel area="header">
        <AppBar
          shadow={false}
          theme={{
            primary: '#27847A',
            accent: '#FFF',
          }}
        >
          <AppBar.Item>WHAT WE DO</AppBar.Item>
          <AppBar.Item active={true}>MAPS</AppBar.Item>
          <AppBar.Item>CONTACT US</AppBar.Item>
        </AppBar>
      </Grid.Panel>
      <Grid.Panel area="search">
        <SearchWrapper>
          <Search
            placeholder="Search"
            color="#216968"
            background="white"
            onSubmit={(s) => {
              setSearch(s === null ? s : s.toLowerCase())
              setShowDialog(false)
            }}
          />
        </SearchWrapper>
      </Grid.Panel>
      <Grid.Panel area="filters">
        <Drawer title="FILTERS" color="white" background="#27847A"></Drawer>
      </Grid.Panel>
      <Grid.Panel area="projects">
        <ListWrapper ref={listWrapperRef}>
          {filteredGeoJson.features.map((feature, index) => (
            <ListCard
              key={index}
              title={`${feature.properties['Name']}`}
              subtitle={`${feature.properties['Name of Lead Partner']}`}
              orientation="left"
              background={
                feature.properties.id === selectedFeature?.properties.id
                  ? '#DFE66730'
                  : '#DCE5E730'
              }
              height="5em"
              width="100%"
              flashColor={GetProjectTypeColour(
                feature.properties['Project Type']
              )}
              onClick={() => {
                setSelectedFeature(feature)
                setShowDialog(true)
              }}
            />
          ))}
        </ListWrapper>
      </Grid.Panel>
      <Grid.Panel area="main" style={{ position: 'relative' }}>
        <Map
          token={process.env.MAPBOX_TOKEN}
          sourceJson={filteredGeoJson}
          initialState={{
            height: '100%',
            width: '100%',
            zoom: 5.5,
            style: process.env.MAPBOX_STYLE,
          }}
          cluster={true}
          clusterOptions={{
            clusterColor: '#216968',
            clusterRadius: 14,
          }}
          pointOptions={{
            pointExpression: pointColourExpression,
            pointRadius: 5,
            onPointClick: (feature) => {
              setSelectedFeature(feature)
              setShowDialog(true)
            },
            pointRadiusExpression: pointRadiusExpression,
            pointStrokeColor: '#8a8988',
            pointStrokeWidth: 1,
          }}
        />
        <Dialog
          open={showDialog}
          setOpen={setShowDialog}
          feature={selectedFeature}
        />
      </Grid.Panel>
    </FullScreenGrid>
  )
}
