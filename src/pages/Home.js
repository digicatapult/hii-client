import React, { useMemo, useState, useEffect, useRef } from 'react'
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

import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../utils/env'
import { GetProjectTypeColour } from '../utils/theme'
import Dialog from './components/Dialog'
import { filterGeoJson, searchFields } from '../utils/search'

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

const searchFieldsConfig = Object.fromEntries(
  searchFields.map(({ searchField }) => [searchField, { fieldType: 'text' }])
)

export default function Home() {
  const [search, setSearch] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [zoomLocation, setZoomLocation] = useState(null)
  const listWrapperRef = useRef({})

  useEffect(() => {
    if (selectedFeature) {
      listWrapperRef.current[selectedFeature.properties.id].scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [selectedFeature])

  const filteredGeoJson = useMemo(
    () => filterGeoJson(geojson, search),
    [search]
  )

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
            fields={searchFieldsConfig}
            placeholder="Search"
            color="#216968"
            background="white"
            onSubmit={(s) => {
              setSearch(s)
              setShowDialog(false)
            }}
          />
        </SearchWrapper>
      </Grid.Panel>
      <Grid.Panel area="filters">
        <Drawer title="FILTERS" color="white" background="#27847A"></Drawer>
      </Grid.Panel>
      <Grid.Panel area="projects">
        <ListWrapper>
          {filteredGeoJson.features.map((feature) => (
            <ListCard
              ref={(el) =>
                (listWrapperRef.current = {
                  ...listWrapperRef.current,
                  [feature.properties.id]: el,
                })
              }
              key={feature.properties.id}
              title={`${feature.properties['Name']}`}
              subtitle={`${feature.properties['Name of Lead Partner']}`}
              orientation="left"
              background={
                feature.properties.id === selectedFeature?.properties.id
                  ? GetProjectTypeColour(
                      feature.properties['Project Type'],
                      '30'
                    )
                  : '#DCE5E730'
              }
              height="5em"
              width="100%"
              flashColor={GetProjectTypeColour(
                feature.properties['Project Type']
              )}
              onClick={() => {
                setSelectedFeature(feature)
                setZoomLocation([
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1],
                ])
                setShowDialog(true)
              }}
            />
          ))}
        </ListWrapper>
      </Grid.Panel>
      <Grid.Panel area="main" style={{ position: 'relative' }}>
        <Map
          token={MAPBOX_TOKEN}
          sourceJson={filteredGeoJson}
          initialState={{
            height: '100%',
            width: '100%',
            zoom: 5.5,
            style: MAPBOX_STYLE,
          }}
          cluster={true}
          clusterOptions={{
            clusterColor: '#216968',
            clusterRadius: 14,
            clusterMaxZoom: 10,
          }}
          pointOptions={{
            pointExpression: pointColourExpression,
            pointRadiusExpression: pointRadiusExpression,
            pointStrokeColor: '#8a8988',
            pointStrokeWidth: 1,
            onPointClick: (feature) => {
              setSelectedFeature(feature)
              setShowDialog(true)
            },
            zoomLocation: zoomLocation,
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
