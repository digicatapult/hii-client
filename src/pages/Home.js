import React from 'react'
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

const Sidebar = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: auto auto 1fr;
`

const ListWrapper = styled.div`
  display: grid;
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

export default function Home() {
  return (
    <Grid
      areas={[
        ['home', 'header', 'header'],
        ['sidebar', 'main', 'main'],
      ]}
      columns={['minmax(10%, 20%)', '1fr', '1fr']}
      rows={['80px', '1000px']} //TODO make 2nd row use rest of vh
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
      <Grid.Panel area="sidebar">
        <Sidebar>
          <SearchWrapper>
            <Search placeholder="Search" color="#216968" background="white" />
          </SearchWrapper>
          <Drawer title="FILTERS" color="white" background="#27847A"></Drawer>
          <ListWrapper>
            {geojson.features.map((i, index) => (
              <ListCard
                key={index} //TODO assign ID?
                title={`${i.properties['Name']}`}
                subtitle={`${i.properties['Name of Lead Partner']}`}
                orientation="left"
                background="#DCE5E7"
                height="5em"
                width="100%"
                onClick={() => {}}
              />
            ))}
          </ListWrapper>
        </Sidebar>
      </Grid.Panel>

      <Grid.Panel area="main">
        <Map
          token={process.env.MAPBOX_TOKEN}
          sourceJson={geojson}
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
    </Grid>
  )
}
