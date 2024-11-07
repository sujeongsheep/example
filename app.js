class LocalMapApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.places = mockPlaces;
        
        this.initMap();
        this.initEventListeners();
        this.renderPlaceList();
    }

    initMap() {
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(37.498095, 127.027610),
            level: 3
        };

        this.map = new kakao.maps.Map(mapContainer, mapOption);
        this.displayMarkers();
    }

    displayMarkers() {
        // 기존 마커들 제거
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];

        // 새로운 마커 생성
        this.places.forEach(place => {
            const position = new kakao.maps.LatLng(
                place.coordinates.latitude,
                place.coordinates.longitude
            );

            const marker = new kakao.maps.Marker({
                position: position,
                map: this.map
            });

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', () => {
                this.showPlaceDetail(place);
            });

            this.markers.push(marker);
        });
    }

    renderPlaceList() {
        const placeList = document.getElementById('placeList');
        placeList.innerHTML = '';

        this.places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.innerHTML = `
                <h3>${place.name}</h3>
                <p>${place.address}</p>
                <p>${place.category.join(', ')}</p>
            `;

            placeCard.addEventListener('click', () => {
                this.showPlaceDetail(place);
            });

            placeList.appendChild(placeCard);
        });
    }

    showPlaceDetail(place) {
        const modal = document.getElementById('placeModal');
        document.getElementById('modalTitle').textContent = place.name;
        document.getElementById('modalAddress').textContent = place.address;
        document.getElementById('modalCategory').textContent = place.category.join(', ');
        document.getElementById('modalDescription').textContent = place.description;
        modal.style.display = 'block';
    }

    initEventListeners() {
        // 검색 기능
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.places = mockPlaces.filter(place => 
                place.name.toLowerCase().includes(searchTerm) ||
                place.address.toLowerCase().includes(searchTerm)
            );
            this.renderPlaceList();
            this.displayMarkers();
        });

        // 모달 닫기
        const closeBtn = document.querySelector('.close');
        const modal = document.getElementById('placeModal');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// 앱 초기화
window.onload = () => {
    new LocalMapApp();
}; 