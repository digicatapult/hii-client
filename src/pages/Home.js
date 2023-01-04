import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Grid,
  Map,
  AppBar,
  Search,
  Drawer,
  ListCard,
} from '@digicatapult/ui-component-library'

import LogoPNG from '../assets/images/hii-logo.png'
import LogoWebP from '../assets/images/hii-logo.webp'
import geojson from '../assets/hii.json'

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

export default function Home() {
  const [search, setSearch] = useState(null)

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
        <Drawer title="FILTERS" color="white" background="#27847A"></Drawer>
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
            pointColor: '#216968',
            pointRadius: 5,
            onPointClick: () => {},
          }}
        />
      </Grid.Panel>
    </FullScreenGrid>
  )
}
