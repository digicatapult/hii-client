const config={mapboxToken:"",mapboxStyle:"mapbox://styles/mapbox/light-v11",publicBasePath:"/"};Window.config||(Window.config={}),Window.config=Object.keys(config).reduce(((o,n)=>(o.hasOwnProperty(n)||(o[n]=config[n]),o)),{});