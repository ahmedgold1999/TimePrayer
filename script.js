// متغيرات عامة
let userLocation = null;
let currentPrayerTimes = null;
let audioPlayer = null;
let isPlaying = false;
let currentCity = 'مكة المكرمة';
let currentCountry = 'السعودية';
let tasbihCount = 0;
let currentTheme = 'default';

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

// مصفوفة السور القرآنية - استخدام مصادر محلية أو مختلفة
const quranSurahs = [
    {
        name: "سورة الفاتحة",
        reciter: "الشيخ عبد الباسط عبد الصمد",
        url: "https://download.quranicaudio.com/quran/abdul_basit_murattal/001.mp3"
    },
    {
        name: "سورة البقرة",
        reciter: "الشيخ ماهر المعيقلي",
        url: "https://download.quranicaudio.com/quran/maher_al_mueaqly/002.mp3"
    },
    {
        name: "سورة آل عمران",
        reciter: "الشيخ سعد الغامدي",
        url: "https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/003.mp3"
    },
    {
        name: "سورة يس",
        reciter: "الشيخ عبد الرحمن السديس",
        url: "https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/036.mp3"
    },
    {
        name: "سورة الرحمن",
        reciter: "الشيخ مشاري العفاسي",
        url: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/055.mp3"
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
    loadSavedTheme();
    loadSavedTasbihCount();
    showLocationModal();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    displayRandomHadith();
    setupQuranPlayer();
    displayRandomDua();
    setupEventListeners();
    setupThemeSelector();
    setupTasbih();
    // تحديث العد التنازلي كل ثانية
    setInterval(updateNextPrayerCountdown, 1000);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // أزرار نافذة الموقع
    document.getElementById('allowLocation').addEventListener('click', requestLocation);
    document.getElementById('denyLocation').addEventListener('click', useDefaultLocation);
    
    // البحث عن المدن - تم تبسيط البحث
    const citySearch = document.getElementById('citySearch');
    const searchBtn = document.getElementById('searchBtn');
    
    // إزالة البحث التلقائي المعقد وإبقاء البحث البسيط فقط
    citySearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSimpleSearch();
        }
    });
    
    searchBtn.addEventListener('click', performSimpleSearch);
    
    // أزرار الميزات الإضافية
    document.getElementById('monthlyCalendarBtn').addEventListener('click', toggleMonthlyCalendar);
    document.getElementById('closeCalendar').addEventListener('click', hideMonthlyCalendar);
    
    // زر الطباعة
    document.getElementById('printBtn').addEventListener('click', printPrayerTimes);
    
    // زر دعاء جديد
    document.getElementById('newDuaBtn').addEventListener('click', displayRandomDua);
    
    // مشغل الصوت
    setupAudioControls();
}

// إعداد اختيار الثيمات
function setupThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
        });
    });
}

// تغيير الثيم
function changeTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // تحديث الثيم النشط
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    // حفظ الثيم في التخزين المحلي
    localStorage.setItem('selectedTheme', theme);
}

// تحميل الثيم المحفوظ
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
}

// إعداد المسبحة الإلكترونية
function setupTasbih() {
    const tasbihBtn = document.getElementById('tasbihBtn');
    const resetBtn = document.getElementById('resetTasbih');
    
    tasbihBtn.addEventListener('click', incrementTasbih);
    resetBtn.addEventListener('click', resetTasbih);
    
    updateTasbihDisplay();
}

// زيادة عداد المسبحة
function incrementTasbih() {
    tasbihCount++;
    updateTasbihDisplay();
    saveTasbihCount();
    
    // إضافة تأثير بصري
    const btn = document.getElementById('tasbihBtn');
    const counter = document.getElementById('tasbihCount');
    
    btn.style.transform = 'scale(0.9)';
    counter.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
        counter.style.transform = 'scale(1)';
    }, 150);
}

// إعادة تعيين المسبحة
function resetTasbih() {
    tasbihCount = 0;
    updateTasbihDisplay();
    saveTasbihCount();
    
    // تأثير بصري للإعادة
    const counter = document.getElementById('tasbihCount');
    counter.style.transform = 'scale(0.8)';
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 200);
}

// تحديث عرض المسبحة
function updateTasbihDisplay() {
    document.getElementById('tasbihCount').textContent = tasbihCount;
}

// حفظ عداد المسبحة
function saveTasbihCount() {
    localStorage.setItem('tasbihCount', tasbihCount.toString());
}

// تحميل عداد المسبحة المحفوظ
function loadSavedTasbihCount() {
    const savedCount = localStorage.getItem('tasbihCount');
    if (savedCount) {
        tasbihCount = parseInt(savedCount);
    }
}

// بحث مبسط بدون API خارجي
function performSimpleSearch() {
    const query = document.getElementById('citySearch').value.trim();
    if (query.length < 2) {
        alert('يرجى إدخال اسم المدينة للبحث');
        return;
    }
    
    // قائمة مدن مبسطة
    const cities = {
        'الرياض': { name: 'الرياض', country: 'السعودية' },
        'جدة': { name: 'جدة', country: 'السعودية' },
        'مكة': { name: 'مكة المكرمة', country: 'السعودية' },
        'المدينة': { name: 'المدينة المنورة', country: 'السعودية' },
        'الدمام': { name: 'الدمام', country: 'السعودية' },
        'القاهرة': { name: 'القاهرة', country: 'مصر' },
        'الإسكندرية': { name: 'الإسكندرية', country: 'مصر' },
        'دبي': { name: 'دبي', country: 'الإمارات' },
        'أبوظبي': { name: 'أبوظبي', country: 'الإمارات' },
        'الكويت': { name: 'الكويت', country: 'الكويت' },
        'الدوحة': { name: 'الدوحة', country: 'قطر' },
        'المنامة': { name: 'المنامة', country: 'البحرين' },
        'مسقط': { name: 'مسقط', country: 'عمان' },
        'عمان': { name: 'عمان', country: 'الأردن' },
        'بيروت': { name: 'بيروت', country: 'لبنان' },
        'دمشق': { name: 'دمشق', country: 'سوريا' },
        'بغداد': { name: 'بغداد', country: 'العراق' },
        'الرباط': { name: 'الرباط', country: 'المغرب' },
        'تونس': { name: 'تونس', country: 'تونس' },
        'الجزائر': { name: 'الجزائر', country: 'الجزائر' }
    };
    
    const foundCity = cities[query] || cities[query.toLowerCase()];
    
    if (foundCity) {
        selectCity(foundCity);
    } else {
        alert('المدينة غير موجودة في القائمة. يرجى المحاولة مع مدينة أخرى.');
    }
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
    loadRegionInfo(currentCity);
}

// الحصول على اسم المدينة من الإحداثيات
async function getCityFromCoordinates(lat, lng) {
    try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`);
        const data = await response.json();
        
        currentCity = data.city || data.locality || 'غير محدد';
        currentCountry = data.countryName || 'غير محدد';
        
        updateLocationDisplay();
        loadRegionInfo(currentCity);
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

// اختيار مدينة من البحث
function selectCity(city) {
    currentCity = city.name;
    currentCountry = city.country;
    
    document.getElementById('citySearch').value = `${city.name}, ${city.country}`;
    updateLocationDisplay();
    
    // تحديث مواقيت الصلاة للمدينة الجديدة
    getPrayerTimesByCity(city.name, city.country);
    loadRegionInfo(city.name);
}

// تحميل معلومات المنطقة من ويكيبديا
async function loadRegionInfo(cityName) {
    try {
        // البحث في ويكيبديا العربية
        const searchResponse = await fetch(`https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
        
        if (searchResponse.ok) {
            const data = await searchResponse.json();
            if (data.extract) {
                document.getElementById('regionInfoText').textContent = data.extract;
                return;
            }
        }
        
        // إذا لم نجد في ويكيبديا العربية، نجرب الإنجليزية
        const englishResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
        
        if (englishResponse.ok) {
            const englishData = await englishResponse.json();
            if (englishData.extract) {
                document.getElementById('regionInfoText').textContent = `معلومات عن ${cityName}: ${englishData.extract}`;
                return;
            }
        }
        
        // إذا لم نجد معلومات
        document.getElementById('regionInfoText').textContent = `لا توجد معلومات متاحة عن ${cityName} في الوقت الحالي.`;
        
    } catch (error) {
        console.error('خطأ في تحميل معلومات المنطقة:', error);
        document.getElementById('regionInfoText').textContent = `لا توجد معلومات متاحة عن ${cityName} في الوقت الحالي.`;
    }
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

// تحديث الصلاة القادمة
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
        totalDiffSeconds += (24 * 60 * 60); // إضافة 24 ساعة إذا كان الوقت سالبًا
    }

    const hours = Math.floor(totalDiffSeconds / 3600);
    const minutes = Math.floor((totalDiffSeconds % 3600) / 60);
    const seconds = totalDiffSeconds % 60;

    const countdownText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('countdownTime').textContent = countdownText;

    document.getElementById('nextPrayerName').textContent = nextPrayerName;
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

// تحويل الوقت من صيغة 24 ساعة إلى دقائق
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// تنسيق الوقت لعرضه
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
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const progressBar = document.querySelector('.progress-bar');
    
    // تحميل سورة عشوائية
    loadRandomSurah();
    
    // أزرار التحكم
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    if (volumeBtn) {
        volumeBtn.addEventListener('click', toggleMute);
    }
    if (progressBar) {
        progressBar.addEventListener('click', seekAudio);
    }
    
    // تحديث التقدم
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', updateDuration);
        audioPlayer.addEventListener('error', handleAudioError);
        audioPlayer.addEventListener('canplay', handleAudioReady);
        audioPlayer.addEventListener('loadstart', handleAudioLoadStart);
        audioPlayer.addEventListener('loadeddata', handleAudioLoadedData);
    }
}

// تحميل سورة عشوائية
function loadRandomSurah() {
    const randomIndex = Math.floor(Math.random() * quranSurahs.length);
    const surah = quranSurahs[randomIndex];
    
    document.getElementById('surahName').textContent = surah.name;
    document.getElementById('reciterName').textContent = surah.reciter;
    
    if (audioPlayer) {
        // إعادة تعيين حالة المشغل
        isPlaying = false;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // تحديث مصدر الصوت
        audioPlayer.src = surah.url;
        audioPlayer.load(); // إعادة تحميل الصوت
        
        // إظهار رسالة التحميل
        document.getElementById('surahName').textContent = 'جاري تحميل السورة...';
        document.getElementById('reciterName').textContent = 'يرجى الانتظار';
    }
}

// معالجة بداية تحميل الصوت
function handleAudioLoadStart() {
    console.log('بدء تحميل الصوت...');
    document.getElementById('surahName').textContent = 'جاري تحميل السورة...';
    document.getElementById('reciterName').textContent = 'يرجى الانتظار';
}

// معالجة تحميل بيانات الصوت
function handleAudioLoadedData() {
    console.log('تم تحميل بيانات الصوت');
    // إعادة عرض معلومات السورة الصحيحة
    const currentSrc = audioPlayer.src;
    for (let i = 0; i < quranSurahs.length; i++) {
        if (currentSrc.includes(quranSurahs[i].url)) {
            document.getElementById('surahName').textContent = quranSurahs[i].name;
            document.getElementById('reciterName').textContent = quranSurahs[i].reciter;
            break;
        }
    }
}

// معالجة خطأ الصوت
function handleAudioError(e) {
    console.error('خطأ في تحميل الصوت:', e);
    console.error('تفاصيل الخطأ:', audioPlayer.error);
    
    // تجربة سورة أخرى
    const currentSrc = audioPlayer.src;
    let nextSurahIndex = 0;
    
    // البحث عن السورة التالية
    for (let i = 0; i < quranSurahs.length; i++) {
        if (currentSrc.includes(quranSurahs[i].url)) {
            nextSurahIndex = (i + 1) % quranSurahs.length;
            break;
        }
    }
    
    const nextSurah = quranSurahs[nextSurahIndex];
    
    // تحديث المعلومات
    document.getElementById('surahName').textContent = nextSurah.name;
    document.getElementById('reciterName').textContent = nextSurah.reciter;
    
    // تحديث المصدر
    audioPlayer.src = nextSurah.url;
    audioPlayer.load();
    
    console.log('تم التبديل إلى سورة أخرى:', nextSurah.name);
}

// معالجة جاهزية الصوت
function handleAudioReady() {
    console.log('الصوت جاهز للتشغيل');
    // التأكد من عرض معلومات السورة الصحيحة
    const currentSrc = audioPlayer.src;
    for (let i = 0; i < quranSurahs.length; i++) {
        if (currentSrc.includes(quranSurahs[i].url)) {
            document.getElementById('surahName').textContent = quranSurahs[i].name;
            document.getElementById('reciterName').textContent = quranSurahs[i].reciter;
            break;
        }
    }
}

// تشغيل/إيقاف الصوت
function togglePlayPause() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (!audioPlayer || !audioPlayer.src) {
        alert('لا يوجد ملف صوتي للتشغيل');
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }).catch(error => {
            console.error('خطأ في تشغيل الصوت:', error);
            alert('لا يمكن تشغيل الملف الصوتي');
        });
    }
}

// كتم/إلغاء كتم الصوت
function toggleMute() {
    const volumeBtn = document.getElementById('volumeBtn');
    
    if (!audioPlayer) return;
    
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        audioPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// البحث في الصوت
function seekAudio(e) {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    const progressBar = e.currentTarget;
    const clickX = e.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

// تحديث شريط التقدم
function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTimeSpan = document.getElementById('currentTimeAudio');
    
    if (!audioPlayer || !progress || !currentTimeSpan) return;
    
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
    if (durationSpan && audioPlayer) {
        durationSpan.textContent = formatAudioTime(audioPlayer.duration);
    }
}

// تنسيق وقت الصوت
function formatAudioTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// إعداد أزرار الصوت
function setupAudioControls() {
    // تم تنفيذها في setupQuranPlayer
}

// عرض دعاء عشوائي
function displayRandomDua() {
    const randomIndex = Math.floor(Math.random() * duas.length);
    const dua = duas[randomIndex];
    
    document.getElementById('duaText').textContent = dua.text;
    document.getElementById('duaSource').textContent = dua.source;
}

// تبديل عرض التقويم الشهري
function toggleMonthlyCalendar() {
    const calendar = document.getElementById('monthlyCalendar');
    if (calendar.classList.contains('hidden')) {
        showMonthlyCalendar();
    } else {
        hideMonthlyCalendar();
    }
}

// إظهار التقويم الشهري
function showMonthlyCalendar() {
    const calendar = document.getElementById('monthlyCalendar');
    calendar.classList.remove('hidden');
    
    // تحديث اسم الشهر
    const currentMonth = new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
    document.getElementById('currentMonth').textContent = currentMonth;
    
    // يمكن إضافة منطق لتحميل مواقيت الشهر هنا
    loadMonthlyPrayerTimes();
}

// إخفاء التقويم الشهري
function hideMonthlyCalendar() {
    document.getElementById('monthlyCalendar').classList.add('hidden');
}

// تحميل مواقيت الشهر
async function loadMonthlyPrayerTimes() {
    const calendarContent = document.getElementById('calendarContent');
    calendarContent.innerHTML = '<p>جاري تحميل مواقيت الشهر...</p>';
    
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        let apiUrl;
        
        // استخدام الإحداثيات إذا كانت متوفرة، وإلا استخدام اسم المدينة
        if (userLocation && userLocation.latitude && userLocation.longitude) {
            apiUrl = `https://api.aladhan.com/v1/calendar/${currentYear}/${currentMonth}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=4`;
        } else {
            apiUrl = `https://api.aladhan.com/v1/calendarByCity/${currentYear}/${currentMonth}?city=${encodeURIComponent(currentCity)}&country=${encodeURIComponent(currentCountry)}&method=4`;
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            displayMonthlyCalendar(data.data);
        } else {
            throw new Error('فشل في تحميل البيانات');
        }
    } catch (error) {
        console.error('خطأ في تحميل مواقيت الشهر:', error);
        calendarContent.innerHTML = `
            <div class="error-message">
                <p>عذراً، حدث خطأ في تحميل مواقيت الشهر</p>
                <p>يرجى المحاولة مرة أخرى لاحقاً</p>
            </div>
        `;
    }
}

// عرض التقويم الشهري
function displayMonthlyCalendar(monthData) {
    const calendarContent = document.getElementById('calendarContent');
    
    let calendarHTML = `
        <div class="monthly-calendar">
            <table class="prayer-times-table">
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
    
    monthData.forEach(dayData => {
        const date = dayData.date.gregorian;
        const timings = dayData.timings;
        
        calendarHTML += `
            <tr>
                <td class="date-cell">
                    <div class="gregorian-date">${date.day} ${getMonthNameArabic(date.month.number)}</div>
                    <div class="hijri-date">${dayData.date.hijri.day} ${dayData.date.hijri.month.ar}</div>
                </td>
                <td>${formatTime(timings.Fajr)}</td>
                <td>${formatTime(timings.Dhuhr)}</td>
                <td>${formatTime(timings.Asr)}</td>
                <td>${formatTime(timings.Maghrib)}</td>
                <td>${formatTime(timings.Isha)}</td>
            </tr>
        `;
    });
    
    calendarHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    calendarContent.innerHTML = calendarHTML;
}

// الحصول على اسم الشهر بالعربية
function getMonthNameArabic(monthNumber) {
    const months = [
        '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[monthNumber] || '';
}

// طباعة المواقيت
function printPrayerTimes() {
    window.print();
}

