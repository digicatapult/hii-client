import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Grid,
  Map,
  AppBar,
  Search,
  Drawer,
  ListCard,
  DropDown,
} from '@digicatapult/ui-component-library'

import LogoPNG from '../assets/images/hii-logo.png'
import LogoWebP from '../assets/images/hii-logo.webp'
import geojson from '../assets/hii.json'

const HomeBar = styled.picture`
  height: 100%;
  margin-left: 20px;
` // margin-left

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
  min-height: 250px;
  height: 100%;
  align-content: start;
  gap: 5px;
  padding: 25px 15px;
`

const FullScreenGrid = styled(Grid)`
  height: 100vh;
  width: 100vw;
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

String.prototype.format = function () {
  return this.toLowerCase().replace(/\s/g, '_')
}

export default function Home() {
  const [search, setSearch] = useState(null)
  const [filter, setFilter] = useState(null)
  const options = {
    projects: geojson.features
      .map(({ properties }) => ({
        value: properties['Project Type'].format(),
        label: properties['Project Type'],
        color: GetProjectTypeColour(properties['Project Type']),
        textColor: 'white', // expand mapping, maybe it's ok?
      }))
      .filter(
        ({ value }, i, a) => a.map(({ value }) => value).indexOf(value) == i
      ),
    hydrogens: [],
  }

  const filteredGeoJson = useMemo(() => {
    if (search === null && filter === null) return geojson
    const { features, ...rest } = geojson

    const filteredFeatures = features.filter(({ properties }) => {
      if (!filter.projects.length > 0) return true
      const project = properties['Project Type'].format()
      // const hydrogen = feature.properties['Type of Hydrogen'].toLowerCase().replace(/\s/g, '_')

      return filter.projects.includes(project)
    })

    if (!search)
      return {
        ...rest,
        features: filteredFeatures,
      }

    return {
      ...rest,
      features: filteredFeatures.filter(({ properties }) =>
        Object.values(properties).some(
          (val) => `${val}`.toLowerCase().indexOf(search) !== -1
        )
      ),
    }
  }, [search, filter])

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
            onSubmit={(s) => setSearch(s === null ? s : s.toLowerCase())}
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
          {filteredGeoJson.features.map((i, index) => (
            <ListCard
              key={index} //TODO assign ID?
              title={`${i.properties['Name']}`}
              subtitle={`${i.properties['Name of Lead Partner']}`}
              orientation="left"
              background="#DCE5E7"
              height="5em"
              width="100%"
              flashColor={GetProjectTypeColour(i.properties['Project Type'])}
              onClick={() => {}}
            />
          ))}
        </ListWrapper>
      </Grid.Panel>

      <Grid.Panel area="main">
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
            onPointClick: () => {},
          }}
        />
      </Grid.Panel>
    </FullScreenGrid>
  )
}
