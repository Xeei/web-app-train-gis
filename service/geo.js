import axios from 'axios'
import GeoJSON from 'ol/format/GeoJSON'

export async function getThai() {
    try {
        let res = await axios.get(
            'http://localhost/geoserver/ku-train/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ku-train%3AAdmin_province_geo_v2&outputFormat=application%2Fjson'
        )
        const features = new GeoJSON().readFeatures(res.data, {
            featureProjection: 'EPSG:4326', // Assuming the map is in Web Mercator
        })
        return features
    } catch (error) {
        return undefined
    }
}
