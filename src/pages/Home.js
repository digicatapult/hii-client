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
  DropDown,
} from '@digicatapult/ui-component-library'

import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../utils/env'
import { getProjectTypeColour } from '../utils/theme'
import Dialog from './components/Dialog'
import Key from './components/Key'
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

const FilterWrapper = styled.div`
  display: grid;
  height: 100%;
  align-content: start;
  gap: 5px;
  padding: 25px 15px;
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

const formatProjectName = (name) => name.toLowerCase().replace(/\s/g, '_')

export default function Home() {
  const [search, setSearch] = useState([])
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filter, setFilter] = useState(null)
  const [zoomLocation, setZoomLocation] = useState(null)
  const listWrapperRef = useRef({})

  const options = {
    projects: geojson.features
      .map(({ properties }) => ({
        value: formatProjectName(properties['Project Type']),
        label: properties['Project Type'],
        color: getProjectTypeColour(properties['Project Type'], 'AA'),
        textColor:
          properties['Project Type'] == ('Feasibility study' || 'Other')
            ? '#FFF'
            : '#27847A',
      }))
      .filter(
        ({ value }, i, a) => a.map(({ value }) => value).indexOf(value) == i
      ),
    hydrogens: [],
  }

  useEffect(() => {
    if (selectedFeature) {
      listWrapperRef.current[selectedFeature.properties.id].scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [selectedFeature])

  // TODO move to search util? filter util.ts?
  const filteredGeoJson = useMemo(() => {
    const { features, ...rest } = filterGeoJson(geojson, search)
    const filteredFeatures = features.filter(({ properties }) => {
      if (!filter?.projects.length > 0) return true
      const project = formatProjectName(properties['Project Type'])
      // const hydrogen = feature.properties['Type of Hydrogen'].toLowerCase().replace(/\s/g, '_')

      return filter.projects.includes(project)
    })

    if (!filter)
      return {
        ...rest,
        features,
      }

    return {
      ...rest,
      features: filteredFeatures,
    }
  }, [search, filter])

  useEffect(() => {
    const selectedInView =
      selectedFeature !== null &&
      !!filteredGeoJson.features.find(
        ({ properties: { id } }) => id === selectedFeature.properties.id
      )

    if (!selectedInView) {
      setSelectedFeature(null)
    }
  }, [filteredGeoJson, selectedFeature])

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
            onSubmit={setSearch}
          />
        </SearchWrapper>
      </Grid.Panel>
      <Grid.Panel area="filters">
        <Drawer title="FILTERS" color="white" background="#27847A">
          <FilterWrapper>
            <DropDown
              isMulti
              placeholder="Select range of maturity"
              label="TYPE OF PROJECT"
              options={options.projects}
              variant="hii"
              update={(res) => {
                setFilter({
                  ...filter,
                  projects: res.map(({ value }) => value),
                })
              }}
            />
            {/*<DropDown isMulti label={'TYPE OF HYDROGEN'} options={options.hydrogens} variant={'hii'} update={(res) => {
              setFilter({ ...filter, hydrogens: res.map(({ value }) => value) })
            }}/>*/}
          </FilterWrapper>
        </Drawer>
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
                  ? getProjectTypeColour(
                      feature.properties['Project Type'],
                      '30'
                    )
                  : '#DCE5E730'
              }
              height="5em"
              width="100%"
              flashColor={getProjectTypeColour(
                feature.properties['Project Type']
              )}
              onClick={() => {
                setSelectedFeature(feature)
                setZoomLocation([
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1],
                ])
              }}
            />
          ))}
        </ListWrapper>
      </Grid.Panel>
      <Grid.Panel area="main" style={{ position: 'relative' }}>
        <Map
          token={MAPBOX_TOKEN}
          sourceJson={filteredGeoJson}
          zoomLocation={zoomLocation}
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
            },
            onClickZoomIn: 11,
          }}
        />
        {selectedFeature === null ? null : (
          <Dialog
            onClose={() => setSelectedFeature(null)}
            feature={selectedFeature}
          />
        )}
        <Key />
      </Grid.Panel>
    </FullScreenGrid>
  )
}
