// script.js
document.getElementById('lookupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const vin = document.getElementById('vin').value;
    const rooftop = document.getElementById('rooftop').value;
    const proxyUrl = `http://garberfleetfix.vercel.app/api/vehicle-details`; // Change this to your proxy server's URL

    const params = new URLSearchParams({
        vin: vin,
        rooftop: rooftop
    });

    const url = `${proxyUrl}?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml'
            }
        });

        const responseText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, 'application/xml');

        const isSuccess = xmlDoc.getElementsByTagName('IsSuccess')[0].textContent === 'true';

        if (isSuccess) {
            const compressedVehicles = xmlDoc.getElementsByTagName('CompressedVehicles')[0].textContent;
            const decodedVehicles = decodeHtml(compressedVehicles);
            const vehicleData = parseVehicleData(decodedVehicles);
            displayResults(vehicleData);
        } else {
            const errorMessage = xmlDoc.getElementsByTagName('ErrorMessage')[0].textContent;
            displayError(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        displayError('An error occurred while fetching the data.');
    }
});

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function parseVehicleData(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const vehicleNode = xmlDoc.getElementsByTagName('V')[0];
    return {
        vin: vehicleNode.getAttribute('_0'),
        stock: vehicleNode.getAttribute('_1'),
        type: vehicleNode.getAttribute('_2'),
        miles: vehicleNode.getAttribute('_3'),
        sellingPrice: vehicleNode.getAttribute('_4'),
        msrp: vehicleNode.getAttribute('_5'),
        bookValue: vehicleNode.getAttribute('_6'),
        invoice: vehicleNode.getAttribute('_7'),
        miscPrice1: vehicleNode.getAttribute('_8'),
        miscPrice2: vehicleNode.getAttribute('_9'),
        miscPrice3: vehicleNode.getAttribute('_10'),
        vehicleId: vehicleNode.getAttribute('_11'),
        hmgroupId: vehicleNode.getAttribute('_12'),
        hnilotId: vehicleNode.getAttribute('_13'),
        year: vehicleNode.getAttribute('_14'),
        make: vehicleNode.getAttribute('_15'),
        model: vehicleNode.getAttribute('_16'),
        stockImage: vehicleNode.getAttribute('_17'),
        factoryCodes: vehicleNode.getAttribute('_18'),
        packageCodes: vehicleNode.getAttribute('_19'),
        daysInStock: vehicleNode.getAttribute('_20'),
        imageCount: vehicleNode.getAttribute('_21'),
        rooftopName: vehicleNode.getAttribute('_22'),
        dealerName: vehicleNode.getAttribute('_23'),
        chromeStyleId: vehicleNode.getAttribute('_24'),
        chromeMultiViewExt1Url: vehicleNode.getAttribute('_25')
    };
}

function displayResults(vehicleData) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Vehicle Information</h2>
        <p><strong>VIN:</strong> ${vehicleData.vin}</p>
        <p><strong>Stock:</strong> ${vehicleData.stock}</p>
        <p><strong>Type:</strong> ${vehicleData.type}</p>
        <p><strong>Miles:</strong> ${vehicleData.miles}</p>
        <p><strong>Selling Price:</strong> ${vehicleData.sellingPrice}</p>
        <p><strong>MSRP:</strong> ${vehicleData.msrp}</p>
        <p><strong>Book Value:</strong> ${vehicleData.bookValue}</p>
        <p><strong>Invoice:</strong> ${vehicleData.invoice}</p>
        <p><strong>Misc Price 1:</strong> ${vehicleData.miscPrice1}</p>
        <p><strong>Misc Price 2:</strong> ${vehicleData.miscPrice2}</p>
        <p><strong>Misc Price 3:</strong> ${vehicleData.miscPrice3}</p>
        <p><strong>Vehicle ID:</strong> ${vehicleData.vehicleId}</p>
        <p><strong>HM Group ID:</strong> ${vehicleData.hmgroupId}</p>
        <p><strong>HN iLot ID:</strong> ${vehicleData.hnilotId}</p>
        <p><strong>Year:</strong> ${vehicleData.year}</p>
        <p><strong>Make:</strong> ${vehicleData.make}</p>
        <p><strong>Model:</strong> ${vehicleData.model}</p>
        <p><strong>Stock Image:</strong> <img src="${vehicleData.stockImage}" alt="Stock Image" /></p>
        <p><strong>Factory Codes:</strong> ${vehicleData.factoryCodes}</p>
        <p><strong>Package Codes:</strong> ${vehicleData.packageCodes}</p>
        <p><strong>Days in Stock:</strong> ${vehicleData.daysInStock}</p>
        <p><strong>Image Count:</strong> ${vehicleData.imageCount}</p>
        <p><strong>Rooftop Name:</strong> ${vehicleData.rooftopName}</p>
        <p><strong>Dealer Name:</strong> ${vehicleData.dealerName}</p>
        <p><strong>Chrome Style ID:</strong> ${vehicleData.chromeStyleId}</p>
        <p><strong>Chrome Multi View Ext1 URL:</strong> <img src="${vehicleData.chromeMultiViewExt1Url}" alt="Chrome Multi View" /></p>
    `;
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
}
