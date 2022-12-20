import React from 'react'
import styled from 'styled-components'
import {
  Grid,
  Map,
  AppBar,
  Search,
  Drawer,
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

const DropdownWrapper = styled.div`
  width: 100%;
  position: relative;
`

const SearchHost = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ containerWidth }) => containerWidth};
  background: ${({ background }) => background};
  font-size: ${({ fontSize }) => fontSize};
`

export default function Home() {
  return (
    <Grid
      areas={[
        ['sidebar', 'header', 'header'],
        ['main', 'main', 'main'],
      ]}
      columns={['minmax(10%, 20%)', '1fr', '1fr']}
      rows={['80px', 'auto']}
    >
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
        <HomeBar></HomeBar>
        <DropdownWrapper>
          <SearchHost
            background="#216968"
            containerWidth="100%"
            fontSize="1rem"
          >
            <Search placeholder="Search" color="#216968" background="white" />
          </SearchHost>
          <Drawer title="FILTERS" color="white" background="#27847A"></Drawer>
        </DropdownWrapper>
      </Grid.Panel>
      <Grid.Panel area="main">
        <Map
          token={process.env.MAPBOX_TOKEN}
          sourceJson={geojson}
          initialState={{ height: '1200px', width: '100%', zoom: 5.5 }}
          cluster={true}
          clusterOptions={{
            clusterColor: '#216968',
            clusterRadius: 14,
          }}
          pointOptions={{
            pointColor: '#216968',
            pointRadius: 5,
            onPointClick: (feature) => {
              console.log(feature)
            },
          }}
        />
      </Grid.Panel>
    </Grid>
  )
}
