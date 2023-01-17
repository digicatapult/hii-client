import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import {
  Grid,
  AppBar,
  Search,
  Drawer,
  ListCard,
  DropDown,
} from '@digicatapult/ui-component-library'

import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../utils/env'
import { getProjectTypeColour } from '../utils/theme'
import Key from './components/Key'
import { filterGeoJson, searchFields } from '../utils/search'

import LogoPNG from '../assets/images/hii-logo.png'
import LogoWebP from '../assets/images/hii-logo.webp'
import geojson from '../assets/hii.json'

const Dialog = lazy(() => import('./components/Dialog'))
const Map = lazy(() => import('./components/Map'))

// give each feature an id and convert hydrogens string into an array
geojson.features = geojson.features.map((f) => {
  return {
    ...f,
    properties: {
      ...f.properties,
      'Type of Hydrogen': f.properties['Type of Hydrogen']
        .split(';')
        .map((type) => type.trim()),
    },
  }
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

const formatKey = (name) => name.toLowerCase().replace(/\s/g, '_')

// TMP this is ugly, being lazzy, options can be hardcoded including project types
const filterOptions = (types = []) => {
  geojson.features.forEach(({ properties }) =>
    properties['Type of Hydrogen'].forEach((hydrogen) =>
      types.push({
        value: hydrogen,
        label: hydrogen,
      })
    )
  )

  return {
    projects: geojson.features
      .map(({ properties }) => ({
        value: formatKey(properties['Project Type']),
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
    hydrogens: types.filter(
      ({ value }, i, a) => a.map(({ value }) => value).indexOf(value) === i
    ),
  }
}

const SuspenseFallback = () => <></>

export default function Home() {
  const [search, setSearch] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [filter, setFilter] = useState({ projects: [], hydrogens: [] })
  const [zoomLocation, setZoomLocation] = useState(null)
  const navigate = useNavigate()
  const listWrapperRef = useRef({})
  const options = filterOptions()
  const { projectId: paramId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchValue(q)
    }
  }, [searchParams])

  useEffect(() => {
    setSearchParams(new URLSearchParams({ q: searchValue }))
  }, [searchValue, setSearchParams])

  useEffect(() => {
    if (paramId) {
      const feature = geojson.features.find(
        ({ properties: { id } }) => id === paramId
      )
      if (feature) {
        setSelectedFeature(feature)
        setZoomLocation([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ])
      }
    }
  }, [paramId])

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
      const { projects, hydrogens } = filter
      const project = formatKey(properties['Project Type'])
      const hydrogen = properties['Type of Hydrogen']

      // TODO when moving to utils, break down into some array helper functions
      if (!projects.length > 0 && !hydrogens.length > 0) return true
      if (hydrogens.length === 0) return projects?.includes(project)
      if (projects.length === 0)
        return hydrogens.some((selected) => hydrogen.includes(selected))

      return (
        hydrogens.some((selected) => hydrogen.includes(selected)) &&
        projects.includes(project)
      )
    })

    return {
      ...rest,
      features: filteredFeatures,
    }
  }, [search, filter])

  useEffect(() => {
    if (selectedFeature === null) return

    const selectedInView = !!filteredGeoJson.features.find(
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
            value={searchValue}
            setValue={setSearchValue}
            onSubmit={(s) => {
              setSearch(s)
            }}
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
            <DropDown
              isMulti
              placeholder="Select type of hydrogen"
              label="TYPE OF HYDROGEN"
              options={options.hydrogens}
              variant="hii"
              update={(res) => {
                setFilter({
                  ...filter,
                  hydrogens: res.map(({ value }) => value),
                })
              }}
            />
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
                navigate(`/${feature.properties.id}`, { replace: true })
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
        <Suspense fallback={<SuspenseFallback />}>
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
                navigate(`/${feature.properties.id}`, { replace: true })
                setSelectedFeature(feature)
              },
              onClickZoomIn: 11,
            }}
          />
        </Suspense>
        {selectedFeature === null ? null : (
          <Suspense fallback={<SuspenseFallback />}>
            <Dialog
              onClose={() => setSelectedFeature(null)}
              feature={selectedFeature}
            />
          </Suspense>
        )}
        <Key />
      </Grid.Panel>
    </FullScreenGrid>
  )
}
