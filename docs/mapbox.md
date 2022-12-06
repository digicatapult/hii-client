# Mapbox

## Glossary

**Datasets** provide access to feature geometries (points, lines, and polygons) and properties (attributes), both of which can be edited in the Mapbox Studio dataset editor or through the Mapbox Datasets API.

**Tilesets** are lightweight collections of vector data that are optimized for rendering (preset zoom levels) and are not editable but can be styled in the Mapbox Studio style editor.

Web maps are comprised of map tiles - Tilesets are created from datasets.

## Collaboration

'Mapbox accounts are shared accounts. Mapbox accounts do not support individual user accounts, or a nested account hierarchy in which multiple accounts are connected to one another. When sharing an account, we recommend you manage your organization's access to Mapbox accounts with SAML Single sign-on (SSO).' [How to enable SSO](https://docs.mapbox.com/accounts/guides/settings/#single-sign-on-authentication-sso).

## [Pricing](https://www.mapbox.com/pricing)

Every area of Mapbox has a **FREE** tier. Paid usage follows a pay as you go model. The following limits apply for free usage:

### Maps

Map JS object loads - 50k/month

Mapbox serves various tile types each with their own request limit:

| Type          | Monthly limit |
| ------------- | ------------- |
| Static image  | 50,000        |
| Vector        | 200,000       |
| Static raster | 200,000       |
| Raster        | 750,000       |

`Tilequery` for retrieving data about specific features from a vector tileset e.g. elevation at a certain lat/long. Limit of 100,000/month requests.

### Search

Geocoding (search) API - 100k/month requests
Permanent (store results) and batch geocoding is paid.

- 50,000/month static images (non-interactive),

### Tileset processing/hosting

Tileset limits are based on zoom level e.g. 1,000,000km<sup>2</sup>/month of tilesets at zoom 11-13 can be created. Higher zoom (more detail) means lower km<sup>2</sup>/month. Hosting usage is the area of all tiles that were created multiplied by the number of days each tileset has existed in your account - hosting limit is the processing limit (of the same zoom level) multiplied by 30.

Example of zoom level 12
![zoom 12 example](./zoom-12-example.png)

Example of zoom level 15
![zoom 15 example](./zoom-15-example.png)

### Rate limits

[Mapbox rate limits](https://docs.mapbox.com/api/overview/#rate-limits)

## Datasets

Map coordinate upload is either CSV or GeoJSON.

Can be uploaded via [`Uploads API`](https://docs.mapbox.com/help/glossary/uploads-api/) or `Mapbox Studio`.

CSV example

```
title,latitude,longitude
University at Albany,42.686744,-73.822852
Siena College,42.718588,-73.755328
Union College,42.814403,-73.930967
The College of St. Rose,42.664351,-73.786562
```

GeoJSON example

```json
{
  "features": [
    {
      "type": "Feature",
      "properties": {
        "title": "Lincoln Park",
        "description": "A northside park that is home to the Lincoln Park Zoo"
      },
      "geometry": {
        "coordinates": [-87.637596, 41.940403],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "title": "Burnham Park",
        "description": "A lakefront park on Chicago's south side"
      },
      "geometry": {
        "coordinates": [-87.603735, 41.829985],
        "type": "Point"
      }
    }
  ],
  "type": "FeatureCollection"
}
```

## Location search

Support for forward/reverse geocoding
https://docs.mapbox.com/api/search/geocoding/
