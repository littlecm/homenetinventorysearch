window.addEventListener("load", async function () {
    await Clerk.load();

    if (Clerk.user) {
        document.getElementById("app").innerHTML = `
            <div id="user-button" class="text-right"></div>
            <div class="container mx-auto p-4" id="main-content">
                <h1 class="text-2xl font-bold text-[#072a60]">Inline Banners Display</h1>
                <div id="banners" class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
            </div>
        `;

        const userButtonDiv = document.getElementById("user-button");
        Clerk.mountUserButton(userButtonDiv);

        fetchInlineBanners();
    } else {
        document.getElementById("app").innerHTML = `
            <div id="sign-in"></div>
        `;

        const signInDiv = document.getElementById("sign-in");
        Clerk.mountSignIn(signInDiv);
    }
});

async function fetchInlineBanners() {
    try {
        const response = await fetch('https://hasura-production-e37d.up.railway.app/api/rest/viewinlinebanners');
        const data = await response.json();
        displayBanners(data.inlinebanners);
    } catch (error) {
        console.error('Error fetching banners:', error);
    }
}

function displayBanners(banners) {
    const bannersDiv = document.getElementById('banners');
    banners.forEach(banner => {
        const bannerElement = document.createElement('div');
        bannerElement.className = 'bg-white p-4 rounded-lg shadow-md';

        bannerElement.innerHTML = `
            <div class="mb-4">
                <img src="${banner.desktopimage}" alt="${banner.accountid} desktop image" class="w-full h-32 object-cover rounded">
            </div>
            <div class="mb-4">
                <img src="${banner.mobileimage}" alt="${banner.accountid} mobile image" class="w-full h-32 object-cover rounded">
            </div>
            <div class="text-center">
                <a href="${banner.url}" class="text-[#072a60] font-semibold hover:underline">${banner.accountid}</a>
            </div>
        `;
        
        bannersDiv.appendChild(bannerElement);
    });
}
