const { app } = require('@azure/functions');
const axios = require('axios');

app.http('GetDisasters', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Fetching NASA EONET Data...');

        try {
            // 1. Call NASA API
            const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v2.1/events?status=open');
            
            // 2. Filter for Wildfires only (Category 8)
            const events = response.data.events;
            const wildfires = events
                .filter(e => e.categories[0].id === 8)
                .map(event => ({
                    id: event.id,
                    title: event.title,
                    lat: event.geometries[0].coordinates[1],
                    lng: event.geometries[0].coordinates[0],
                    size: 1.5, 
                    color: 'orange'
                }));

            // 3. Return clean JSON
            return {
                status: 200,
                jsonBody: wildfires, // Note: In V4 we use 'jsonBody' for JSON
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } catch (error) {
            context.log(`Error: ${error.message}`);
            return {
                status: 500,
                body: "Error fetching NASA data"
            };
        }
    }
});