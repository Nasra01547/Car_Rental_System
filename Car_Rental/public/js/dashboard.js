
// SIDBAR
const allDropdown = document.querySelectorAll('#side-bar .side-dropdown');
const sideBar = document.getElementById('side-bar');

allDropdown.forEach(item => {
    const a = item.parentElement.querySelector('a:first-child');
    // console.log(a);
    a.addEventListener('click', function (e) {
        e.preventDefault();

        if (!this.classList.contains('active')) {
            allDropdown.forEach(elements => {
                const aLink = elements.parentElement.querySelector('a:first-child');
                aLink.classList.remove('active')
                elements.classList.remove('show')

            })
        }

        this.classList.toggle('active')
        item.classList.toggle('show')
    })
});

//SIDEBAR COLLAPS   
const toggleSidebar = document.querySelector('nav .toggle-side-bar');
const allSideDivider = document.querySelectorAll('#side-bar .divider');

if (sideBar.classList.contains('hide')) {
    allSideDivider.forEach(i => {
        i.textContent = '-'
    });
    allDropdown.forEach(item => {
        const a = item.parentElement.querySelector('a:first-child');
        a.classList.remove('active');
        item.classListr.remove('show')
    });
} else {
    allSideDivider.forEach(i => {
        i.textContent = i.dataset.text;
    })
}

toggleSidebar.addEventListener('click', function () {
    sideBar.classList.toggle('hide');

    if (sideBar.classList.contains('hide')) {
        allSideDivider.forEach(i => {
            i.textContent = '-'
        });
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');
            a.classList.remove('active');
            item.classListr.remove('show')
        });
    } else {
        allSideDivider.forEach(i => {
            i.textContent = i.dataset.text;
        })
    }
});
//SIDEBAR COLLAPS

sideBar.addEventListener('mouseleave', function () {
    if (this.classList.contains('hide')) {
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');

            a.classList.remove('active')
            item.classList.remove('show')
        })
        allSideDivider.forEach(i => {
            i.textContent = '-'
        })
    }
});

sideBar.addEventListener('mouseenter', function () {
    if (this.classList.contains('hide')) {
        allDropdown.forEach(item => {
            const a = item.parentElement.querySelector('a:first-child');

            a.classList.remove('active')
            item.classList.remove('show')
        })
        allSideDivider.forEach(i => {
            i.textContent = i.dataset.text;
        })
    }
});



//PROFILE DROPDOWN

const profile = document.querySelector('nav .profile');
const imgProfile = document.querySelector('img');
const dropdownProfile = document.querySelector('.profile-link');


imgProfile.addEventListener('click', function () {
    dropdownProfile.classList.toggle('show');
});

//MENU
const allMenu = document.querySelectorAll('.dashboard-main .content-data .head .menu');
allMenu.forEach(item => {
    const icon = item.querySelector('.icon');
    const menuLink = item.querySelector('.menu-link');

    icon.addEventListener('click', function () {
        menuLink.classList.toggle('show')
    })
});

//MENU

window.addEventListener('click', function (e) {
    if (e.target !== imgProfile) {
        if (e.target !== dropdownProfile) {
            if (dropdownProfile.classList.contains('show')) {
                dropdownProfile.classList.remove('show')
            }
        }
    }
    allMenu.forEach(item => {
        const icon = item.querySelector('.icon');
        const menuLink = item.querySelector('.menu-link');

        if (e.target !== icon) {
            if (e.target !== menuLink) {
                if (menuLink.classList.contains('show')) {
                    menuLink.classList.remove('show')
                }
            }
        }
    })

})
//PROFILE DROPDOWN


//NAVIGATE PAGES
function showSection(sectionId, element) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.add('active');

    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.side-manu a');
    menuItems.forEach(item => item.classList.remove('active'));

    // Add active class to the clicked item
    element.classList.add('active');
}
//NAVIGATE PAGES


// Image preview
document.addEventListener('DOMContentLoaded', function () {
    const logoInput = document.getElementById('logo-id');
    const fakeUploadLogo = document.getElementById('fakeUploadLogo');
    const imgPreview = document.querySelector('.img-preview');

    logoInput.addEventListener('change', function () {
        const filename = this.value.split('\\').pop();
        fakeUploadLogo.value = filename;

        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});
// Image preview