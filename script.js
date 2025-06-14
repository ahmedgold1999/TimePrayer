// متغيرات عامة
let userLocation = null;
let currentPrayerTimes = null;
let audioPlayer = null;
let isPlaying = false;
let currentCity = 'مكة المكرمة';
let currentCountry = 'السعودية';

// مصفوفة الأحاديث النبوية
const hadiths = [
    {
        text: "قال رسول الله صلى الله عليه وسلم: \"الصلاة عماد الدين، من أقامها أقام الدين، ومن هدمها هدم الدين\"",
        source: "رواه البيهقي"
    },
    {
        text: "قال رسول الله صلى الله عليه وسلم: \"بين الرجل وبين الشرك والكفر ترك الصلاة\"",
        source: "رواه مسلم"
    },
    {
        text: "قال رسول الله صلى الله عليه وسلم: \"أول ما يحاسب عليه العبد يوم القيامة الصلاة، فإن صلحت صلح سائر عمله، وإن فسدت فسد سائر عمله\"",
        source: "رواه الطبراني"
    },
    {
        text: "قال رسول الله صلى الله عليه وسلم: \"من حافظ على الصلوات الخمس، ركوعهن وسجودهن ووضوئهن ومواقيتهن، وعلم أنهن حق من عند الله، دخل الجنة\"",
        source: "رواه أحمد"
    },
    {
        text: "قال رسول الله صلى الله عليه وسلم: \"إن أحب الأعمال إلى الله الصلاة على وقتها\"",
        source: "متفق عليه"
    }
];

// مصفوفة السور القرآنية
const quranSurahs = [
    {
        name: "سورة الفاتحة",
        reciter: "الشيخ عبد الباسط عبد الصمد",
        url: "https://server8.mp3quran.net/abd_basit/001.mp3"
    },
    {
        name: "سورة البقرة",
        reciter: "الشيخ ماهر المعيقلي",
        url: "https://server8.mp3quran.net/maher/002.mp3"
    },
    {
        name: "سورة آل عمران",
        reciter: "الشيخ سعد الغامدي",
        url: "https://server7.mp3quran.net/s_gmd/003.mp3"
    },
    {
        name: "سورة يس",
        reciter: "الشيخ عبد الرحمن السديس",
        url: "https://server11.mp3quran.net/sds/036.mp3"
    },
    {
        name: "سورة الرحمن",
        reciter: "الشيخ مشاري العفاسي",
        url: "https://server8.mp3quran.net/afs/055.mp3"
    }
];

// مصفوفة الأدعية
const duas = [
    {
        text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
        source: "دعاء من السنة النبوية"
    },
    {
        text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
        source: "سورة البقرة"
    },
    {
        text: "اللهم اهدني فيمن هديت، وعافني فيمن عافيت، وتولني فيمن توليت",
        source: "دعاء القنوت"
    },
    {
        text: "رب اشرح لي صدري ويسر لي أمري واحلل عقدة من لساني يفقهوا قولي",
        source: "دعاء موسى عليه السلام"
    },
    {
        text: "اللهم إني أسألك من الخير كله عاجله وآجله، ما علمت منه وما لم أعلم",
        source: "دعاء جامع من السنة"
    },
    {
        text: "ربنا لا تؤاخذنا إن نسينا أو أخطأنا",
        source: "سورة البقرة"
    },
    {
        text: "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي",
        source: "دعاء من السنة النبوية"
    },
    {
        text: "رب اغفر لي ذنبي وخطئي وجهلي",
        source: "دعاء من السنة النبوية"
    }
];

// تشغيل الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// تهيئة التطبيق
function initializeApp() {
    showLocationModal();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    displayRandomHadith();
    setupQuranPlayer();
    displayRandomDua();
    setupEventListeners();
    // تحديث العد التنازلي كل ثانية
    setInterval(updateNextPrayerCountdown, 1000);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // أزرار نافذة الموقع
    document.getElementById('allowLocation').addEventListener('click', requestLocation);
    document.getElementById('denyLocation').addEventListener('click', useDefaultLocation);
    
    // البحث عن المدن
    const citySearch = document.getElementById('citySearch');
    citySearch.addEventListener('input', handleCitySearch);
    citySearch.addEventListener('focus', showSearchSuggestions);
    citySearch.addEventListener('blur', hideSearchSuggestions);
    
    // أزرار الميزات الإضافية
    document.getElementById('monthlyCalendarBtn').addEventListener('click', toggleMonthlyCalendar);
    document.getElementById('nearbyCitiesBtn').addEventListener('click', toggleNearbyCities);
    document.getElementById('closeCalendar').addEventListener('click', hideMonthlyCalendar);
    document.getElementById('closeCities').addEventListener('click', hideNearbyCities);
    
    // زر الطباعة
    document.getElementById('printBtn').addEventListener('click', printPrayerTimes);
    
    // زر دعاء جديد
    document.getElementById('newDuaBtn').addEventListener('click', displayRandomDua);
    
    // مشغل الصوت
    setupAudioControls();
}

// عرض نافذة طلب الموقع
function showLocationModal() {
    document.getElementById('locationModal').style.display = 'flex';
}

// إخفاء نافذة طلب الموقع
function hideLocationModal() {
    document.getElementById('locationModal').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('locationModal').style.display = 'none';
    }, 300);
}

// طلب الموقع من المستخدم
function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                hideLocationModal();
                getCityFromCoordinates(userLocation.latitude, userLocation.longitude);
                getPrayerTimes(userLocation.latitude, userLocation.longitude);
            },
            error => {
                console.error('خطأ في الحصول على الموقع:', error);
                useDefaultLocation();
            }
        );
    } else {
        alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
        useDefaultLocation();
    }
}

// استخدام الموقع الافتراضي (مكة المكرمة)
function useDefaultLocation() {
    hideLocationModal();
    userLocation = {
        latitude: 21.4225,
        longitude: 39.8262
    };
    currentCity = 'مكة المكرمة';
    currentCountry = 'السعودية';
    updateLocationDisplay();
    getPrayerTimes(userLocation.latitude, userLocation.longitude);
}

// الحصول على اسم المدينة من الإحداثيات
async function getCityFromCoordinates(lat, lng) {
    try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`);
        const data = await response.json();
        
        currentCity = data.city || data.locality || 'غير محدد';
        currentCountry = data.countryName || 'غير محدد';
        
        updateLocationDisplay();
    } catch (error) {
        console.error('خطأ في الحصول على اسم المدينة:', error);
        currentCity = 'موقع غير محدد';
        currentCountry = '';
        updateLocationDisplay();
    }
}

// تحديث عرض الموقع
function updateLocationDisplay() {
    document.getElementById('cityName').textContent = currentCity;
    document.getElementById('countryName').textContent = currentCountry;
}

// البحث عن المدن
async function handleCitySearch(event) {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    try {
        // البحث باستخدام GeoDB Cities API
        // استخدام HTTPS بدلاً من HTTP لتجنب مشاكل CORS في بعض المتصفحات
        const response = await fetch(`https://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5&languageCode=ar`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            displaySearchSuggestions(data.data);
        } else {
            hideSearchSuggestions();
        }
    } catch (error) {
        console.error('خطأ في البحث عن المدن:', error);
        hideSearchSuggestions();
    }
}

// عرض اقتراحات البحث
function displaySearchSuggestions(cities) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = '';
    
    cities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = `${city.name}, ${city.country}`;
        
        suggestionItem.addEventListener('mousedown', () => { // استخدام mousedown بدلاً من click لتجنب مشكلة blur
            selectCity(city);
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    suggestionsContainer.classList.add('show');
}

// اختيار مدينة من الاقتراحات
function selectCity(city) {
    currentCity = city.name;
    currentCountry = city.country;
    
    document.getElementById('citySearch').value = `${city.name}, ${city.country}`;
    hideSearchSuggestions();
    updateLocationDisplay();
    
    // تحديث مواقيت الصلاة للمدينة الجديدة
    getPrayerTimesByCity(city.name, city.country);
}

// إظهار اقتراحات البحث
function showSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer.children.length > 0) {
        suggestionsContainer.classList.add('show');
    }
}

// إخفاء اقتراحات البحث
function hideSearchSuggestions() {
    setTimeout(() => {
        document.getElementById('searchSuggestions').classList.remove('show');
    }, 200);
}

// الحصول على مواقيت الصلاة بالإحداثيات
async function getPrayerTimes(lat, lng) {
    try {
        const today = new Date();
        const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=4`);
        const data = await response.json();
        
        if (data.code === 200) {
            currentPrayerTimes = data.data.timings;
            displayPrayerTimes(currentPrayerTimes);
            updateNextPrayer();
            // لا نستخدم setInterval هنا لتجنب تكرار التحديثات عند تغيير المدينة
        }
    } catch (error) {
        console.error('خطأ في الحصول على مواقيت الصلاة:', error);
    }
}

// الحصول على مواقيت الصلاة بالمدينة
async function getPrayerTimesByCity(city, country) {
    try {
        const today = new Date();
        const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateString}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`);
        const data = await response.json();
        
        if (data.code === 200) {
            currentPrayerTimes = data.data.timings;
            displayPrayerTimes(currentPrayerTimes);
            updateNextPrayer();
        }
    } catch (error) {
        console.error('خطأ في الحصول على مواقيت الصلاة:', error);
    }
}

// عرض مواقيت الصلاة
function displayPrayerTimes(timings) {
    const prayerNames = {
        'Fajr': { name: 'الفجر', icon: 'fas fa-sun', class: 'fajr' },
        'Dhuhr': { name: 'الظهر', icon: 'fas fa-sun', class: 'dhuhr' },
        'Asr': { name: 'العصر', icon: 'fas fa-cloud-sun', class: 'asr' },
        'Maghrib': { name: 'المغرب', icon: 'fas fa-moon', class: 'maghrib' },
        'Isha': { name: 'العشاء', icon: 'fas fa-star', class: 'isha' }
    };
    
    const grid = document.getElementById('prayerTimesGrid');
    grid.innerHTML = '';
    
    Object.keys(prayerNames).forEach(prayer => {
        const prayerCard = document.createElement('div');
        prayerCard.className = `prayer-card ${prayerNames[prayer].class}`;
        
        prayerCard.innerHTML = `
            <div class="prayer-icon">
                <i class="${prayerNames[prayer].icon}"></i>
            </div>
            <div class="prayer-name">${prayerNames[prayer].name}</div>
            <div class="prayer-time">${formatTime(timings[prayer])}</div>
        `;
        
        grid.appendChild(prayerCard);
    });
}

// تحديث الصلاة القادمة (تحديد الصلاة القادمة فقط)
function updateNextPrayer() {
    if (!currentPrayerTimes) return;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'الفجر', time: currentPrayerTimes.Fajr, key: 'Fajr' },
        { name: 'الظهر', time: currentPrayerTimes.Dhuhr, key: 'Dhuhr' },
        { name: 'العصر', time: currentPrayerTimes.Asr, key: 'Asr' },
        { name: 'المغرب', time: currentPrayerTimes.Maghrib, key: 'Maghrib' },
        { name: 'العشاء', time: currentPrayerTimes.Isha, key: 'Isha' }
    ];
    
    let nextPrayer = null;
    let nextPrayerIndex = -1;
    
    for (let i = 0; i < prayers.length; i++) {
        const prayerTime = timeToMinutes(prayers[i].time);
        if (prayerTime > currentTime) {
            nextPrayer = prayers[i];
            nextPrayerIndex = i;
            break;
        }
    }
    
    // إذا لم نجد صلاة اليوم، فالصلاة القادمة هي فجر الغد
    if (!nextPrayer) {
        nextPrayer = prayers[0]; // فجر الغد
        nextPrayerIndex = 0;
    }
    
    // تحديث عرض الصلاة القادمة
    document.getElementById('nextPrayerName').textContent = nextPrayer.name;
    document.getElementById('nextPrayerTime').textContent = formatTime(nextPrayer.time);
    
    // تمييز الصلاة القادمة
    highlightNextPrayer(nextPrayer.key);
}

// تحديث العد التنازلي للصلاة القادمة
function updateNextPrayerCountdown() {
    if (!currentPrayerTimes) return;

    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const prayers = [
        { name: 'الفجر', time: currentPrayerTimes.Fajr, key: 'Fajr' },
        { name: 'الظهر', time: currentPrayerTimes.Dhuhr, key: 'Dhuhr' },
        { name: 'العصر', time: currentPrayerTimes.Asr, key: 'Asr' },
        { name: 'المغرب', time: currentPrayerTimes.Maghrib, key: 'Maghrib' },
        { name: 'العشاء', time: currentPrayerTimes.Isha, key: 'Isha' }
    ];

    let nextPrayerTimeInMinutes = -1;
    let nextPrayerName = '';

    // البحث عن الصلاة القادمة
    for (let i = 0; i < prayers.length; i++) {
        const prayerTime = timeToMinutes(prayers[i].time);
        if (prayerTime > currentTimeInMinutes) {
            nextPrayerTimeInMinutes = prayerTime;
            nextPrayerName = prayers[i].name;
            break;
        }
    }

    // إذا كانت جميع الصلوات قد مرت لليوم، فالصلاة القادمة هي فجر الغد
    if (nextPrayerTimeInMinutes === -1) {
        nextPrayerTimeInMinutes = timeToMinutes(prayers[0].time) + (24 * 60); // فجر الغد
        nextPrayerName = prayers[0].name;
    }

    let totalDiffMinutes = nextPrayerTimeInMinutes - currentTimeInMinutes;
    let totalDiffSeconds = (totalDiffMinutes * 60) - currentSeconds;

    if (totalDiffSeconds < 0) {
        totalDiffSeconds += (24 * 60 * 60); // إضافة 24 ساعة إذا كان الوقت سالبًا (انتقل لليوم التالي)
    }

    const hours = Math.floor(totalDiffSeconds / 3600);
    const minutes = Math.floor((totalDiffSeconds % 3600) / 60);
    const seconds = totalDiffSeconds % 60;

    const countdownText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('countdownTime').textContent = countdownText;

    // تحديث اسم الصلاة القادمة ووقتها في الواجهة
    document.getElementById('nextPrayerName').textContent = nextPrayerName;
    // يجب أن يكون وقت الصلاة القادمة هو الوقت الفعلي للصلاة وليس وقت العد التنازلي
    // هذا الجزء يتم تحديثه في updateNextPrayer()، لذا لا داعي لتكراره هنا
}

// تمييز الصلاة القادمة
function highlightNextPrayer(prayerKey) {
    // إزالة التمييز من جميع البطاقات
    document.querySelectorAll('.prayer-card').forEach(card => {
        card.classList.remove('next');
    });
    
    // إضافة التمييز للصلاة القادمة
    const prayerClasses = {
        'Fajr': 'fajr',
        'Dhuhr': 'dhuhr',
        'Asr': 'asr',
        'Maghrib': 'maghrib',
        'Isha': 'isha'
    };
    
    const nextCard = document.querySelector(`.prayer-card.${prayerClasses[prayerKey]}`);
    if (nextCard) {
        nextCard.classList.add('next');
    }
}

// تحويل الوقت إلى دقائق
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// تنسيق الوقت
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// تحديث الوقت الحالي
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('currentTime').textContent = timeString;
}

// عرض/إخفاء جدول المواقيت الشهرية
function toggleMonthlyCalendar() {
    const calendar = document.getElementById('monthlyCalendar');
    if (calendar.classList.contains('hidden')) {
        showMonthlyCalendar();
    } else {
        hideMonthlyCalendar();
    }
}

// عرض جدول المواقيت الشهرية
async function showMonthlyCalendar() {
    const calendar = document.getElementById('monthlyCalendar');
    const content = document.getElementById('calendarContent');
    
    // تحديث عنوان الشهر
    const now = new Date();
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    document.getElementById('currentMonth').textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    
    // جلب مواقيت الشهر
    try {
        let url;
        if (userLocation) {
            url = `https://api.aladhan.com/v1/calendar/${now.getFullYear()}/${now.getMonth() + 1}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=4`;
        } else {
            url = `https://api.aladhan.com/v1/calendarByCity/${now.getFullYear()}/${now.getMonth() + 1}?city=${encodeURIComponent(currentCity)}&country=${encodeURIComponent(currentCountry)}&method=4`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            displayMonthlyCalendar(data.data);
        } else {
            content.innerHTML = `<p>حدث خطأ في تحميل مواقيت الشهر: ${data.status}</p>`;
        }
    } catch (error) {
        console.error('خطأ في جلب مواقيت الشهر:', error);
        content.innerHTML = '<p>حدث خطأ في تحميل مواقيت الشهر</p>';
    }
    
    calendar.classList.remove('hidden');
}

// عرض جدول المواقيت الشهرية
function displayMonthlyCalendar(monthData) {
    const content = document.getElementById('calendarContent');
    
    let tableHTML = `
        <table class="calendar-table">
            <thead>
                <tr>
                    <th>التاريخ</th>
                    <th>الفجر</th>
                    <th>الظهر</th>
                    <th>العصر</th>
                    <th>المغرب</th>
                    <th>العشاء</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    monthData.forEach(day => {
        // التأكد من أن التاريخ موجود وصحيح
        const gregorianDate = day.date.gregorian.date;
        const dayNumber = day.date.gregorian.day; // استخدام day مباشرة
        
        tableHTML += `
            <tr>
                <td>${dayNumber}</td>
                <td>${formatTime(day.timings.Fajr)}</td>
                <td>${formatTime(day.timings.Dhuhr)}</td>
                <td>${formatTime(day.timings.Asr)}</td>
                <td>${formatTime(day.timings.Maghrib)}</td>
                <td>${formatTime(day.timings.Isha)}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    content.innerHTML = tableHTML;
}

// إخفاء جدول المواقيت الشهرية
function hideMonthlyCalendar() {
    document.getElementById('monthlyCalendar').classList.add('hidden');
}

// عرض/إخفاء المدن القريبة
function toggleNearbyCities() {
    const cities = document.getElementById('nearbyCities');
    if (cities.classList.contains('hidden')) {
        showNearbyCities();
    } else {
        hideNearbyCities();
    }
}

// عرض المدن القريبة
async function showNearbyCities() {
    const cities = document.getElementById('nearbyCities');
    const content = document.getElementById('citiesContent');
    
    if (!userLocation) {
        content.innerHTML = '<p>يرجى السماح بتحديد الموقع أولاً لعرض المدن القريبة.</p>';
        cities.classList.remove('hidden');
        return;
    }
    
    try {
        // جلب المدن القريبة باستخدام GeoDB Cities API
        // استخدام HTTPS بدلاً من HTTP لتجنب مشاكل CORS في بعض المتصفحات
        const response = await fetch(`https://geodb-free-service.wirefreethought.com/v1/geo/locations/${userLocation.latitude}${userLocation.longitude >= 0 ? '+' : ''}${userLocation.longitude}/nearbyPlaces?radius=100&limit=10&types=CITY&languageCode=ar`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            displayNearbyCities(data.data);
        } else {
            content.innerHTML = '<p>لم يتم العثور على مدن قريبة.</p>';
        }
    } catch (error) {
        console.error('خطأ في جلب المدن القريبة:', error);
        content.innerHTML = '<p>حدث خطأ في تحميل المدن القريبة. يرجى التأكد من اتصال الإنترنت.</p>';
    }
    
    cities.classList.remove('hidden');
}

// عرض قائمة المدن القريبة
function displayNearbyCities(cities) {
    const content = document.getElementById('citiesContent');
    content.innerHTML = '';
    
    cities.forEach(city => {
        const cityItem = document.createElement('div');
        cityItem.className = 'city-item';
        
        cityItem.innerHTML = `
            <div class="city-name">${city.name}</div>
            <div class="city-distance">${Math.round(city.distance)} كم</div>
        `;
        
        cityItem.addEventListener('click', () => {
            selectNearbyCity(city);
        });
        
        content.appendChild(cityItem);
    });
}

// اختيار مدينة قريبة
function selectNearbyCity(city) {
    currentCity = city.name;
    currentCountry = city.country || currentCountry;
    
    updateLocationDisplay();
    hideNearbyCities();
    
    // تحديث مواقيت الصلاة للمدينة الجديدة
    getPrayerTimes(city.latitude, city.longitude);
}

// طباعة المواقيت
function printPrayerTimes() {
    // إخفاء العناصر غير المرغوب فيها عند الطباعة باستخدام CSS
    window.print();
}

// عرض حديث عشوائي
function displayRandomHadith() {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    const hadith = hadiths[randomIndex];
    
    document.getElementById('hadithText').textContent = hadith.text;
    document.getElementById('hadithSource').textContent = hadith.source;
}

// إعداد مشغل القرآن
function setupQuranPlayer() {
    audioPlayer = document.getElementById('audioPlayer');
    const randomIndex = Math.floor(Math.random() * quranSurahs.length);
    const surah = quranSurahs[randomIndex];
    
    document.getElementById('surahName').textContent = surah.name;
    document.getElementById('reciterName').textContent = surah.reciter;
    audioPlayer.src = surah.url;
}

// إعداد عناصر التحكم في الصوت
function setupAudioControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.getElementById('progress');
    
    // زر التشغيل/الإيقاف
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // زر الصوت
    volumeBtn.addEventListener('click', toggleMute);
    
    // شريط التقدم
    progressBar.addEventListener('click', seekAudio);
    
    // تحديث شريط التقدم
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

// تشغيل/إيقاف الصوت
function togglePlayPause() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    } else {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }
}

// كتم/إلغاء كتم الصوت
function toggleMute() {
    const volumeBtn = document.getElementById('volumeBtn');
    
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        audioPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// البحث في الصوت
function seekAudio(event) {
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

// تحديث شريط التقدم
function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTimeSpan = document.getElementById('currentTimeAudio');
    
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = progressPercent + '%';
        
        currentTimeSpan.textContent = formatAudioTime(currentTime);
    }
}

// تحديث مدة الصوت
function updateDuration() {
    const durationSpan = document.getElementById('durationAudio');
    durationSpan.textContent = formatAudioTime(audioPlayer.duration);
}

// تنسيق وقت الصوت
function formatAudioTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// عرض دعاء عشوائي
function displayRandomDua() {
    const randomIndex = Math.floor(Math.random() * duas.length);
    const dua = duas[randomIndex];
    
    const duaCard = document.getElementById('duaCard');
    duaCard.classList.add('fade-in');
    
    document.getElementById('duaText').textContent = dua.text;
    document.getElementById('duaSource').textContent = dua.source;
    
    // إزالة تأثير fade-in بعد انتهاء الحركة
    setTimeout(() => {
        duaCard.classList.remove('fade-in');
    }, 500);
}

