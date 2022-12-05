import { createGlobalStyle } from 'styled-components'
import AktivGroteskWoff from './AktivGrotesk.woff'
import AktivGroteskWoff2 from './AktivGrotesk.woff2'
import OpenSansWoff from './OpenSans.woff'
import OpenSansWoff2 from './OpenSans.woff2'
import Monaco from './Monaco.woff'

export default createGlobalStyle`
    @font-face {
        font-family: 'AktivGrotesk';
        src: local('Aktiv Grotesk'), local('AktivGrotesk'),
        url(${AktivGroteskWoff2}) format('woff2'),
        url(${AktivGroteskWoff}) format('woff');
        font-style: normal;
    }
    @font-face {
        font-family: 'OpenSans';
        src: local('OpenSans'), local('Open Sans'),
        url(${OpenSansWoff2}) format('woff2'),
        url(${OpenSansWoff}) format('woff');
        font-style: normal;
    }
    @font-face {
        font-family: 'Monaco';
        src: local('Monaco'), local('Monaco'),
        url(${Monaco}) format('woff');
        font-style: normal;
    }
`
