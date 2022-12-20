import { createGlobalStyle } from 'styled-components'
import Roboto from './Roboto-Regular.woff'

export default createGlobalStyle`
    @font-face {
        font-family: 'Roboto';
        src: local('Roboto'), local('Roboto'),
        url(${Roboto}) format('woff');
        font-style: normal;
    }
`
