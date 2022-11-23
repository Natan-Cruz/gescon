module.exports = {
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: 'src/service-worker.js',
        },
        name: "Gescon.tec",
        themeColor: "#ff7700",
        manifestOptions: {
            name: "Gescon.tec",
            short_name: "Gescon",
            start_url: "/",
            display: "standalone",
            theme_color: "#ff7700"
        }
    }
}