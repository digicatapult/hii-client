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

import Logo from '../assets/images/hii-logo.png'
import geojson from '../assets/hii.json'

const HomeBar = styled.div`
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${Logo});
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
        <HomeBar></HomeBar>
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
              flashColor="#27847A"
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
