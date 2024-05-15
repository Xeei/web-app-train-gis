'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Feature, Map, View } from 'ol'
import { OSM } from 'ol/source'
import ImageWMS from 'ol/source/ImageWMS'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer'
import { get } from 'ol/proj'
import { getThai } from '@/service/geo'

export default function Mymap({ props }) {
    const mapRef = useRef(null)
    const [raster1, setRaster1] = useState(null)
    const [raster2, setRaster2] = useState(null)
    const [vector1, setVector1] = useState(null)

    useEffect(() => {
        const basemap = new TileLayer({
            source: new OSM(),
        })

        const vectorSource = new VectorSource()
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            visible: false,
        })

        const raster = new ImageLayer({
            source: new ImageWMS({
                url: 'http://localhost/geoserver/ku-train/wms',
                params: {
                    SERVICE: 'WMS',
                    VERSION: '1.1.0',
                    REQUEST: 'GetMap',
                    FORMAT: 'image/png',
                    TRANSPARENT: true,
                    STYLES: '',
                    LAYERS: 'avg-01-01',
                    EXCEPTIONS: 'application/vnd.ogc.se_inimage',
                    SRS: 'EPSG:4326',
                    // WIDTH: 50,
                    // HEIGHT: 50,
                    // BBOX: '96.0%2C5.0%2C106.0%2C21.0',
                },
            }),
            visible: false,
        })

        const raster_SMAP = new ImageLayer({
            source: new ImageWMS({
                url: 'http://localhost/geoserver/ku-train/wms',
                params: {
                    SERVICE: 'WMS',
                    VERSION: '1.1.0',
                    REQUEST: 'GetMap',
                    FORMAT: 'image/png',
                    TRANSPARENT: true,
                    STYLES: '',
                    LAYERS: 'SMAP_L2_SM_SP_20240303',
                    EXCEPTIONS: 'application/vnd.ogc.se_inimage',
                    SRS: 'EPSG:4326',
                    // WIDTH: 50,
                    // HEIGHT: 50,
                    // BBOX: '96.0%2C5.0%2C106.0%2C21.0',
                },
            }),
            visible: false,
        })

        const initmap = new Map({
            layers: [basemap, raster, raster_SMAP, vectorLayer],
            target: mapRef.current,
            view: new View({
                projection: 'EPSG:4326',
                center: [100, 9],
                zoom: 6,
            }),
        })

        getThai().then((features) => {
            if (features) {
                vectorSource.addFeatures(features)
                initmap.getView().fit(vectorSource.getExtent(), {
                    size: initmap.getSize(),
                    maxZoom: 10,
                })
            }
        })

        setRaster1(raster)
        setRaster2(raster_SMAP)
        setVector1(vectorLayer)

        return () => {
            initmap.setTarget(undefined)
        }
    }, [])

    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <div
                style={{
                    width: '10vw',
                }}
            >
                <p>control</p>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <input
                        type="checkbox"
                        // checked={rasterVisible1}
                        onChange={(e) => raster1.setVisible(e.target.checked)}
                    />
                    <p>ฝน</p>
                </div>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <input
                        type="checkbox"
                        // checked={rasterVisible1}
                        onChange={(e) => raster2.setVisible(e.target.checked)}
                    />
                    <p>SMAP</p>
                </div>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <input
                        type="checkbox"
                        // checked={rasterVisible1}
                        onChange={(e) => vector1.setVisible(e.target.checked)}
                    />
                    <p>Thailand</p>
                </div>
            </div>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            ></div>
        </div>
    )
}
