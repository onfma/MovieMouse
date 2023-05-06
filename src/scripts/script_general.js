/* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    function DropdownFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
          
    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.sideMenuButton')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    function positionTranzitie() {
        var headerImage = document.getElementById('header-image');
        var tranzitie = document.querySelector('.tranzitie');
        var pageTitleBox = document.querySelector('.pageTitleBox');
        var headerHeight = headerImage.offsetHeight-160;
        tranzitie.style.top = headerHeight + 'px';
        pageTitleBox.style.top = headerHeight + 'px';
    }

    