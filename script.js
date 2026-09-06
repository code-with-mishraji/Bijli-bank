/* =========================================================
   BIJLIBANK — MASTER SCRIPT ENGINE
   ========================================================= */

/* =========================================================
   GLOBAL DATA & STATE MANAGEMENT
========================================================= */

let currentUser = null;
let appliances = [];
let isSignupMode = false;
let ELECTRICITY_RATE = 6.08;
let FIXED_CHARGE = 100;
let monthlyBudget = 0;
let currentApplianceFilter = "all";
let compareMonthsMode = "current";
let editingApplianceId = null;
let videoStream = null;

/* =========================================================
   DOM ELEMENTS
========================================================= */

const electricLoader = document.getElementById("electric-loader");
const loaderStageA = document.getElementById("loaderStageA");
const loaderStageB = document.getElementById("loaderStageB");
const loaderProgressBar = document.getElementById("loaderProgressBar");
const loaderStatusText = document.getElementById("loaderStatusText");

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");
const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const nameField = document.getElementById("nameField");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");
const userName = document.getElementById("userName");

const devicePhoto = document.getElementById("devicePhoto");
const cameraBtn = document.getElementById("cameraBtn");
const demoScan = document.getElementById("demoScan");
const scanStatus = document.getElementById("scanStatus");
const scanResult = document.getElementById("scanResult");
const deviceName = document.getElementById("deviceName");
const powerInput = document.getElementById("powerInput");
const hoursInput = document.getElementById("hours");
const detectedDevice = document.getElementById("detectedDevice");
const dailyKwh = document.getElementById("dailyKwh");
const monthlyKwh = document.getElementById("monthlyKwh");
const monthlyCost = document.getElementById("monthlyCost");
const extraCost = document.getElementById("extraCost");
const addDevice = document.getElementById("addDevice");

const deviceGrid = document.getElementById("deviceGrid");
const topAppliances = document.getElementById("topAppliances");
const todayUsage = document.getElementById("todayUsage");
const todayCost = document.getElementById("todayCost");
const monthUsage = document.getElementById("monthUsage");
const estimatedBill = document.getElementById("estimatedBill");
const potentialSaving = document.getElementById("potentialSaving");

const analyticsTotal = document.getElementById("analyticsTotal");
const analyticsAverage = document.getElementById("analyticsAverage");
const analyticsHighest = document.getElementById("analyticsHighest");
const donutTotal = document.getElementById("donutTotal");
const consumptionLegend = document.getElementById("consumptionLegend");

const predictionAmount = document.getElementById("predictionAmount");
const predictionRange = document.getElementById("predictionRange");
const predictionMiddle = document.getElementById("predictionMiddle");
const predictionMeter = document.getElementById("predictionMeter");
const energyCharges = document.getElementById("energyCharges");
const fixedCharges = document.getElementById("fixedCharges");
const taxCharges = document.getElementById("taxCharges");
const predictionTotal = document.getElementById("predictionTotal");

const savingTip = document.getElementById("savingTip");
const savingTipTitle = document.getElementById("savingTipTitle");
const insightTitle = document.getElementById("insightTitle");
const insightText = document.getElementById("insightText");
const usageProgress = document.getElementById("usageProgress");
const usageComparison = document.getElementById("usageComparison");

/* Profile & Dropdown Elements */
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileDropdownName = document.getElementById("profileDropdownName");
const profileDropdownEmail = document.getElementById("profileDropdownEmail");
const tariffMenuBtn = document.getElementById("tariffMenuBtn");
const billingHistoryBtn = document.getElementById("billingHistoryBtn");
const headerLogoutBtn = document.getElementById("headerLogoutBtn");

/* Navigation Elements */
const menuBtn = document.getElementById("menuBtn");
const mobileDrawer = document.getElementById("mobileDrawer");
const mobileDrawerBackdrop = document.getElementById("mobileDrawerBackdrop");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");

/* Modals */
const tariffModal = document.getElementById("tariffModal");
const tariffRateInput = document.getElementById("tariffRateInput");
const tariffFixedInput = document.getElementById("tariffFixedInput");
const saveTariffBtn = document.getElementById("saveTariffBtn");
const tariffMessage = document.getElementById("tariffMessage");
const dashboardTariffBtn = document.getElementById("dashboardTariffBtn");

const billingHistoryModal = document.getElementById("billingHistoryModal");
const billingHistoryList = document.getElementById("billingHistoryList");

const addManuallyBtn = document.getElementById("addManuallyBtn");
const manualAddModal = document.getElementById("manualAddModal");
const manualNameInput = document.getElementById("manualNameInput");
const manualPowerInput = document.getElementById("manualPowerInput");
const manualHoursInput = document.getElementById("manualHoursInput");
const saveManualAddBtn = document.getElementById("saveManualAddBtn");
const manualAddMessage = document.getElementById("manualAddMessage");

const editApplianceModal = document.getElementById("editApplianceModal");
const editNameInput = document.getElementById("editNameInput");
const editPowerInput = document.getElementById("editPowerInput");
const editHoursInput = document.getElementById("editHoursInput");
const saveEditApplianceBtn = document.getElementById("saveEditApplianceBtn");
const editApplianceMessage = document.getElementById("editApplianceMessage");

const setBudgetBtn = document.getElementById("setBudgetBtn");
const budgetModal = document.getElementById("budgetModal");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const budgetMessage = document.getElementById("budgetMessage");
const budgetProgress = document.getElementById("budgetProgress");
const budgetProgressText = document.getElementById("budgetProgressText");
const budgetProgressFill = document.getElementById("budgetProgressFill");

const exportReportBtn = document.getElementById("exportReportBtn");
const compareMonthsBtn = document.getElementById("compareMonthsBtn");
const torchBtn = document.getElementById("torchBtn");
const retakeBtn = document.getElementById("retakeBtn");
const loadWarningBadge = document.getElementById("loadWarningBadge");
const applianceFilterTabs = document.querySelectorAll(".filter-tab");


/* =========================================================
   1. STARTUP ANIMATION SEQUENCE
========================================================= */

function runStartupSequence() {
    if (sessionStorage.getItem("bijliBankStartupDone")) {
        if (electricLoader) electricLoader.classList.add("fade-out");
        return;
    }

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 4;
        if (loaderProgressBar) loaderProgressBar.style.width = `${progress}%`;

        if (progress === 40 && loaderStatusText) {
            loaderStatusText.textContent = "CONNECTING GRID...";
        }
        if (progress === 80 && loaderStatusText) {
            loaderStatusText.textContent = "INITIALIZING INTELLIGENCE...";
        }

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(transitionToTagline, 400);
        }
    }, 40);
}

function transitionToTagline() {
    if (!loaderStageA || !loaderStageB) return;

    loaderStageA.classList.remove("active");
    loaderStageB.classList.add("active");

    const lines = loaderStageB.querySelectorAll(".tagline-line");
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add("reveal");
        }, index * 320);
    });

    setTimeout(() => {
        if (electricLoader) electricLoader.classList.add("fade-out");
        sessionStorage.setItem("bijliBankStartupDone", "true");
    }, (lines.length * 320) + 1200);
}


/* =========================================================
   2. HELPER FUNCTIONS & MODAL CONTROLS
========================================================= */

function formatMoney(value) {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("hidden");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
}

document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.dataset.closeModal));
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeModal(overlay.id);
    });
});

function getApplianceIcon(name) {
    const val = name.toLowerCase();
    if (val.includes("ac") || val.includes("air conditioner")) return "❄";
    if (val.includes("fridge") || val.includes("refrigerator")) return "▣";
    if (val.includes("fan")) return "◌";
    if (val.includes("tv") || val.includes("television")) return "▱";
    if (val.includes("geyser") || val.includes("heater")) return "♨";
    if (val.includes("washing")) return "◎";
    if (val.includes("computer") || val.includes("laptop")) return "⌘";
    if (val.includes("light") || val.includes("bulb")) return "◉";
    return "ϟ";
}


/* =========================================================
   3. AUTHENTICATION & USER MANAGEMENT
========================================================= */

function setAuthMode(mode) {
    isSignupMode = mode === "signup";
    if (isSignupMode) {
        if (signupTab) signupTab.classList.add("active");
        if (loginTab) loginTab.classList.remove("active");
        if (nameField) nameField.classList.remove("hidden");
        if (authSubmit) authSubmit.textContent = "Create account →";
    } else {
        if (loginTab) loginTab.classList.add("active");
        if (signupTab) signupTab.classList.remove("active");
        if (nameField) nameField.classList.add("hidden");
        if (authSubmit) authSubmit.textContent = "Login →";
    }
    if (authMessage) authMessage.textContent = "";
}

if (loginTab) loginTab.addEventListener("click", () => setAuthMode("login"));
if (signupTab) signupTab.addEventListener("click", () => setAuthMode("signup"));

function getUsers() {
    return JSON.parse(localStorage.getItem("bijliBank_users") || "{}");
}

function saveUsers(users) {
    localStorage.setItem("bijliBank_users", JSON.stringify(users));
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value;

    if (!email || !password) {
        authMessage.textContent = "Please fill in all required fields.";
        return;
    }

    const users = getUsers();

    if (isSignupMode) {
        const name = authName.value.trim() || "User";
        if (users[email]) {
            authMessage.textContent = "Account with this email already exists.";
            return;
        }
        users[email] = { name, email, password, appliances: [], tariff: 6.08, fixed: 100, budget: 0 };
        saveUsers(users);
        loginUser(users[email]);
    } else {
        if (!users[email] || users[email].password !== password) {
            authMessage.textContent = "Invalid email or password.";
            return;
        }
        loginUser(users[email]);
    }
}

if (authForm) authForm.addEventListener("submit", handleAuthSubmit);

function loginUser(user) {
    currentUser = user;
    localStorage.setItem("bijliBank_activeUser", user.email);

    ELECTRICITY_RATE = user.tariff || 6.08;
    FIXED_CHARGE = user.fixed || 100;
    monthlyBudget = user.budget || 0;
    appliances = user.appliances || [];

    if (userName) userName.textContent = user.name;
    if (profileBtn) profileBtn.textContent = user.name.charAt(0).toUpperCase();
    if (profileDropdownName) profileDropdownName.textContent = user.name;
    if (profileDropdownEmail) profileDropdownEmail.textContent = user.email;

    updateRateDisplays();

    authScreen.classList.add("hidden");
    app.classList.remove("hidden");

    updateCalculations();
}

function checkAutoLogin() {
    const activeEmail = localStorage.getItem("bijliBank_activeUser");
    if (activeEmail) {
        const users = getUsers();
        if (users[activeEmail]) {
            loginUser(users[activeEmail]);
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem("bijliBank_activeUser");
    app.classList.add("hidden");
    authScreen.classList.remove("hidden");
    if (profileDropdown) profileDropdown.classList.add("hidden");
}

if (headerLogoutBtn) headerLogoutBtn.addEventListener("click", logout);


/* =========================================================
   4. NAVIGATION & MOBILE DRAWER
========================================================= */

function switchPage(targetSection) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });
    const targetPage = document.getElementById(targetSection);
    if (targetPage) targetPage.classList.add("active-page");

    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
        if (link.dataset.section === targetSection) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    closeMobileDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-section]").forEach(button => {
    button.addEventListener("click", () => switchPage(button.dataset.section));
});

function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add("open");
}

function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove("open");
}

if (menuBtn) menuBtn.addEventListener("click", openMobileDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeMobileDrawer);
if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener("click", closeMobileDrawer);

if (profileBtn) {
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("hidden");
    });
}

document.addEventListener("click", (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
        profileDropdown.classList.add("hidden");
    }
});


/* =========================================================
   5. SCANNER & CALCULATION LOGIC
========================================================= */

function updateScannerCalculations() {
    const power = parseFloat(powerInput.value) || 0;
    const hours = parseFloat(hoursInput.value) || 0;

    const dailyKwhVal = (power * hours) / 1000;
    const monthlyKwhVal = dailyKwhVal * 30;
    const monthlyCostVal = monthlyKwhVal * ELECTRICITY_RATE;

    const extraHoursKwh = (power * (hours + 2)) / 1000 * 30;
    const extraCostVal = (extraHoursKwh * ELECTRICITY_RATE) - monthlyCostVal;

    if (dailyKwh) dailyKwh.textContent = `${dailyKwhVal.toFixed(2)} kWh`;
    if (monthlyKwh) monthlyKwh.textContent = `${monthlyKwhVal.toFixed(1)} kWh`;
    if (monthlyCost) monthlyCost.textContent = formatMoney(monthlyCostVal);
    if (extraCost) extraCost.textContent = `+ ${formatMoney(extraCostVal)}/month`;

    if (loadWarningBadge) {
        if (power >= 800) {
            loadWarningBadge.textContent = "HEAVY LOAD";
            loadWarningBadge.className = "tag heavy";
        } else {
            loadWarningBadge.textContent = "ECO LOAD";
            loadWarningBadge.className = "tag eco";
        }
    }
}

if (powerInput) powerInput.addEventListener("input", updateScannerCalculations);
if (hoursInput) hoursInput.addEventListener("input", updateScannerCalculations);

if (demoScan) {
    demoScan.addEventListener("click", () => {
        if (scanStatus) scanStatus.textContent = "Scanning demo: Split AC 1.5 Ton...";
        setTimeout(() => {
            if (detectedDevice) detectedDevice.textContent = "Split AC · 1.5 Ton";
            if (deviceName) deviceName.value = "Air Conditioner";
            if (powerInput) powerInput.value = 1500;
            if (hoursInput) hoursInput.value = 6;
            if (scanStatus) scanStatus.textContent = "Device identified successfully!";
            if (scanResult) scanResult.classList.remove("hidden");
            if (retakeBtn) retakeBtn.classList.remove("hidden");
            updateScannerCalculations();
        }, 600);
    });
}

if (devicePhoto) {
    devicePhoto.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (scanStatus) scanStatus.textContent = `File selected: ${file.name}`;
            if (detectedDevice) detectedDevice.textContent = file.name.split('.')[0] || "Custom Device";
            if (deviceName) deviceName.value = file.name.split('.')[0] || "Custom Device";
            if (powerInput) powerInput.value = 750;
            if (hoursInput) hoursInput.value = 4;
            if (scanResult) scanResult.classList.remove("hidden");
            if (retakeBtn) retakeBtn.classList.remove("hidden");
            updateScannerCalculations();
        }
    });
}

if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
        if (devicePhoto) devicePhoto.value = "";
        if (scanStatus) scanStatus.textContent = "No image selected";
        if (scanResult) scanResult.classList.add("hidden");
        if (retakeBtn) retakeBtn.classList.add("hidden");
    });
}

if (addDevice) {
    addDevice.addEventListener("click", () => {
        const name = deviceName.value.trim() || "New Device";
        const power = parseFloat(powerInput.value) || 0;
        const hours = parseFloat(hoursInput.value) || 0;

        appliances.push({
            id: Date.now(),
            name,
            power,
            hours,
            enabled: true
        });

        saveUserData();
        updateCalculations();
        switchPage("appliances");
    });
}


/* =========================================================
   6. APPLIANCE MANAGEMENT & CRUD
========================================================= */

function saveUserData() {
    if (!currentUser) return;
    const users = getUsers();
    users[currentUser.email] = {
        ...users[currentUser.email],
        appliances,
        tariff: ELECTRICITY_RATE,
        fixed: FIXED_CHARGE,
        budget: monthlyBudget
    };
    saveUsers(users);
}

function renderAppliances() {
    if (!deviceGrid) return;
    deviceGrid.innerHTML = "";

    const filtered = appliances.filter(app => {
if (currentApplianceFilter === "heavy") return app.power >= 800;
        if (currentApplianceFilter === "light") return app.power < 800;
        return true;
    });

    filtered.forEach(app => {
        const card = document.createElement("article");
        card.className = `device-card ${!app.enabled ? "device-off" : ""}`;

        const icon = getApplianceIcon(app.name);
        const monthlyKwhVal = (app.power * app.hours * 30) / 1000;
        const monthlyCostVal = monthlyKwhVal * ELECTRICITY_RATE;

        card.innerHTML = `
            <div class="device-card-actions">
                <button class="device-icon-btn edit-btn" title="Edit Appliance">✎</button>
                <button class="device-icon-btn delete-btn" title="Delete Appliance">✕</button>
            </div>
            <div>
                <div class="device-card-top">
                    <div class="device-icon">${icon}</div>
                    <button class="device-toggle ${app.enabled ? "on" : ""}" title="Toggle Power"></button>
                </div>
                <h3>${escapeHTML(app.name)}</h3>
                <p>${app.power} W · ${app.hours} hrs/day</p>
            </div>
            <div class="device-cost">
                <strong>${formatMoney(monthlyCostVal)}/mo</strong>
                <small>${monthlyKwhVal.toFixed(1)} kWh</small>
            </div>
        `;

        card.querySelector(".device-toggle").addEventListener("click", () => {
            app.enabled = !app.enabled;
            saveUserData();
            updateCalculations();
        });

        card.querySelector(".edit-btn").addEventListener("click", () => {
            editingApplianceId = app.id;
            if (editNameInput) editNameInput.value = app.name;
            if (editPowerInput) editPowerInput.value = app.power;
            if (editHoursInput) editHoursInput.value = app.hours;
            openModal("editApplianceModal");
        });

        card.querySelector(".delete-btn").addEventListener("click", () => {
            appliances = appliances.filter(item => item.id !== app.id);
            saveUserData();
            updateCalculations();
        });

        deviceGrid.appendChild(card);
    });

    const addCard = document.createElement("article");
    addCard.className = "device-card add-card";
    addCard.innerHTML = `
        <div class="plus">+</div>
        <h3>Add appliance</h3>
        <p>Scan a new device</p>
    `;
    addCard.addEventListener("click", () => switchPage("scan"));
    deviceGrid.appendChild(addCard);
}

if (applianceFilterTabs) {
    applianceFilterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            applianceFilterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentApplianceFilter = tab.dataset.filter;
            renderAppliances();
        });
    });
}

if (addManuallyBtn) {
    addManuallyBtn.addEventListener("click", () => openModal("manualAddModal"));
}

if (saveManualAddBtn) {
    saveManualAddBtn.addEventListener("click", () => {
        const name = manualNameInput.value.trim();
        const power = parseFloat(manualPowerInput.value);
        const hours = parseFloat(manualHoursInput.value);

        if (!name || isNaN(power) || isNaN(hours)) {
            if (manualAddMessage) manualAddMessage.textContent = "Please provide valid inputs.";
            return;
        }

        appliances.push({ id: Date.now(), name, power, hours, enabled: true });
        saveUserData();
        updateCalculations();
        closeModal("manualAddModal");

        manualNameInput.value = "";
        manualPowerInput.value = "";
        manualHoursInput.value = "";
    });
}

if (saveEditApplianceBtn) {
    saveEditApplianceBtn.addEventListener("click", () => {
        const name = editNameInput.value.trim();
        const power = parseFloat(editPowerInput.value);
        const hours = parseFloat(editHoursInput.value);

        if (!name || isNaN(power) || isNaN(hours)) {
            if (editApplianceMessage) editApplianceMessage.textContent = "Please fill all fields.";
            return;
        }

        const appObj = appliances.find(a => a.id === editingApplianceId);
        if (appObj) {
            appObj.name = name;
            appObj.power = power;
            appObj.hours = hours;
            saveUserData();
            updateCalculations();
        }

        closeModal("editApplianceModal");
    });
}

/* =========================================================
   7. CORE CALCULATIONS & UI SYNCHRONIZATION
========================================================= */

function updateCalculations() {
    renderAppliances();

    let totalDailyKwh = 0;
    let activeHeavyPower = 0;

    appliances.forEach(app => {
        if (app.enabled) {
            totalDailyKwh += (app.power * app.hours) / 1000;
            if (app.power >= 800) activeHeavyPower += app.power;
        }
    });

    const totalMonthlyKwh = totalDailyKwh * 30;
    const energyCost = totalMonthlyKwh * ELECTRICITY_RATE;
    const tax = energyCost * 0.05;
    const totalBill = energyCost + FIXED_CHARGE + tax;
    const dailyCostVal = totalDailyKwh * ELECTRICITY_RATE;

    if (activeHeavyPower > 0) {
        document.body.classList.add("heavy-load-theme");
    } else {
        document.body.classList.remove("heavy-load-theme");
    }

    if (todayUsage) todayUsage.textContent = totalDailyKwh.toFixed(1);
    if (todayCost) todayCost.textContent = formatMoney(dailyCostVal);
    if (monthUsage) monthUsage.innerHTML = `${totalMonthlyKwh.toFixed(1)} <i>kWh</i>`;
    if (estimatedBill) estimatedBill.textContent = formatMoney(totalBill);
    if (potentialSaving) potentialSaving.textContent = formatMoney(energyCost * 0.15);

    if (usageProgress) usageProgress.style.width = `${Math.min(100, (totalDailyKwh / 20) * 100)}%`;

    if (analyticsTotal) analyticsTotal.textContent = `${totalMonthlyKwh.toFixed(1)} kWh`;
    if (analyticsAverage) analyticsAverage.textContent = `${totalDailyKwh.toFixed(1)} kWh`;

    const activeApps = appliances.filter(a => a.enabled);
    if (activeApps.length > 0) {
        const highest = activeApps.reduce((prev, curr) => (curr.power > prev.power) ? curr : prev);
        if (analyticsHighest) analyticsHighest.textContent = highest.name;
    } else {
        if (analyticsHighest) analyticsHighest.textContent = "—";
    }

    if (predictionAmount) predictionAmount.textContent = formatMoney(totalBill);
    if (predictionRange) predictionRange.textContent = `– ${formatMoney(totalBill * 1.15)}`;
    if (predictionMiddle) predictionMiddle.textContent = formatMoney(totalBill);
    if (predictionMeter) predictionMeter.style.width = `${Math.min(100, (totalBill / 5000) * 100)}%`;

    if (energyCharges) energyCharges.textContent = formatMoney(energyCost);
    if (fixedCharges) fixedCharges.textContent = formatMoney(FIXED_CHARGE);
    if (taxCharges) taxCharges.textContent = formatMoney(tax);
    if (predictionTotal) predictionTotal.textContent = formatMoney(totalBill);

    if (monthlyBudget > 0 && budgetProgress) {
        budgetProgress.classList.remove("hidden");
        if (budgetProgressText) budgetProgressText.textContent = `${formatMoney(totalBill)} / ${formatMoney(monthlyBudget)}`;
        const pct = Math.min(100, (totalBill / monthlyBudget) * 100);
        if (budgetProgressFill) {
            budgetProgressFill.style.width = `${pct}%`;
            if (totalBill > monthlyBudget) {
                budgetProgressFill.classList.add("over-budget");
            } else {
                budgetProgressFill.classList.remove("over-budget");
            }
        }
    } else if (budgetProgress) {
        budgetProgress.classList.add("hidden");
    }

    renderTopAppliances();
    renderChart(totalDailyKwh);
}

function renderTopAppliances() {
    if (!topAppliances) return;
    topAppliances.innerHTML = "";

    const activeApps = appliances.filter(a => a.enabled);
    if (activeApps.length === 0) {
        topAppliances.innerHTML = '<div class="empty-state">No active appliances added yet.</div>';
        return;
    }

    activeApps.sort((a, b) => b.power * b.hours - a.power * a.hours);
    const maxKwh = (activeApps[0].power * activeApps[0].hours * 30) / 1000 || 1;

    activeApps.slice(0, 4).forEach(app => {
        const kwh = (app.power * app.hours * 30) / 1000;
        const pct = Math.min(100, (kwh / maxKwh) * 100);

        const row = document.createElement("div");
        row.className = "appliance-bar";
        row.innerHTML = `
            <span class="appliance-bar-name">${escapeHTML(app.name)}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${pct}%"></div>
            </div>
            <span class="appliance-bar-value">${kwh.toFixed(0)} kWh</span>
        `;
        topAppliances.appendChild(row);
    });
}

function renderChart(dailyKwh) {
    const path = document.getElementById("usagePath");
    if (!path) return;

    const points = [
        dailyKwh * 0.8,
        dailyKwh * 0.9,
        dailyKwh * 1.1,
        dailyKwh * 0.95,
        dailyKwh * 1.2,
        dailyKwh * 1.05,
        dailyKwh
    ];

    const maxVal = Math.max(...points, 10);
    const width = 700;
    const height = 175;

    let d = "";
    points.forEach((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val / maxVal) * (height - 20));
        d += (idx === 0) ? `M ${x},${y}` : ` L ${x},${y}`;
    });

    path.setAttribute("d", d);
}

/* =========================================================
   8. TARIFF, BUDGET & EXPORT FEATURES
========================================================= */

function updateRateDisplays() {
    document.querySelectorAll(".current-rate-text").forEach(el => {
        el.textContent = ELECTRICITY_RATE.toFixed(2);
    });
}

if (dashboardTariffBtn) {
    dashboardTariffBtn.addEventListener("click", () => {
        if (tariffRateInput) tariffRateInput.value = ELECTRICITY_RATE;
        if (tariffFixedInput) tariffFixedInput.value = FIXED_CHARGE;
        openModal("tariffModal");
    });
}

if (tariffMenuBtn) {
    tariffMenuBtn.addEventListener("click", () => {
        if (tariffRateInput) tariffRateInput.value = ELECTRICITY_RATE;
        if (tariffFixedInput) tariffFixedInput.value = FIXED_CHARGE;
        openModal("tariffModal");
    });
}

if (saveTariffBtn) {
    saveTariffBtn.addEventListener("click", () => {
        const rate = parseFloat(tariffRateInput.value);
        const fixed = parseFloat(tariffFixedInput.value);

        if (isNaN(rate) || isNaN(fixed)) {
            if (tariffMessage) tariffMessage.textContent = "Please enter valid values.";
            return;
        }

        ELECTRICITY_RATE = rate;
        FIXED_CHARGE = fixed;
        updateRateDisplays();
        saveUserData();
        updateCalculations();
        closeModal("tariffModal");
    });
}

if (setBudgetBtn) {
    setBudgetBtn.addEventListener("click", () => {
        if (budgetInput) budgetInput.value = monthlyBudget || 3000;
        openModal("budgetModal");
    });
}

if (saveBudgetBtn) {
    saveBudgetBtn.addEventListener("click", () => {
        const bVal = parseFloat(budgetInput.value);
        if (isNaN(bVal) || bVal <= 0) {
            if (budgetMessage) budgetMessage.textContent = "Please enter a valid target budget.";
            return;
        }
        monthlyBudget = bVal;
        saveUserData();
        updateCalculations();
        closeModal("budgetModal");
    });
}

if (exportReportBtn) {
    exportReportBtn.addEventListener("click", () => {
        let csv = "Appliance Name,Power Rating (W),Daily Hours,Monthly Usage (kWh),Est. Monthly Cost (INR)\n";
        appliances.forEach(app => {
            const kwh = (app.power * app.hours * 30) / 1000;
            const cost = kwh * ELECTRICITY_RATE;
            csv += `"${app.name}",${app.power},${app.hours},${kwh.toFixed(2)},${cost.toFixed(2)}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `BijliBank_Report_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });
}


/* =========================================================
   9. INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    runStartupSequence();
    checkAutoLogin();
});

