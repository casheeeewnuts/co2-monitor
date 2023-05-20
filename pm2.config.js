module.exports = {
    apps: [
        {
            name: 'co2-monitor',
            script: './build/bin/start.js',
            watch: false,
            env: {
                ENDPOINT: '',
                AWS_ACCESS_KEY_ID: '',
                AWS_SECRET_ACCESS: ''
            }
        }
    ]
}