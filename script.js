window.addEventListener("load", async function () {
    await Clerk.load();

    if (Clerk.user) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("main-content").style.display = "block";

        const userButtonDiv = document.getElementById("user-button");
        Clerk.mountUserButton(userButtonDiv);

        fetchInlineBanners();
    } else {
        document.getElementById("loading").style.display = "none";
        document.getElementById("app").innerHTML = `<div id="sign-in"></div>`;
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
    const bannersTbody = document.getElementById('banners');
    banners.forEach(banner => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="py-2 px-4 border-b">${banner.accountid}</td>
            <td class="py-2 px-4 border-b"><a href="#" class="text-[#072a60] hover:underline" onclick="showModal('${banner.desktopimage}')">${banner.desktopimage}</a></td>
            <td class="py-2 px-4 border-b"><a href="#" class="text-[#072a60] hover:underline" onclick="showModal('${banner.mobileimage}')">${banner.mobileimage}</a></td>
            <td class="py-2 px-4 border-b"><a href="${banner.url}" class="text-[#072a60] hover:underline">${banner.url}</a></td>
        `;

        bannersTbody.appendChild(row);
    });
}

function showModal(imageUrl) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl;
    modal.classList.remove('hidden');
}

document.getElementById('close-modal').addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
});
