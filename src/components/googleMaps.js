import React, { useState, useEffect, useRef }from "react";

const Map = ({ options, onMount, className, onMountProps }) => {
    const ref = useRef()
    const [map, setMap] = useState()

    useEffect(() => {
      const onLoad = () => setMap(new window.google.maps.Map(ref.current, options))
      if (!window.google) {
        const script = document.createElement(`script`)
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        document.head.append(script)
        script.addEventListener(`load`, onLoad)
        return () => script.removeEventListener(`load`, onLoad)
      } else onLoad()
    }, [options])
  
    if (map && typeof onMount === `function`) onMount(onMountProps)(map)

    return (
      <div
        style={{ height: `60vh`, margin: `1em 0`, borderRadius: `0.5em` }}
        {...{ ref, className }}
      />

    )
  };


  Map.defaultProps = {
    options: {
      center: { lat: 36.778259, lng: -119.417931 },
      zoom: 6,
    }
  }
  
  export default Map;


