// ─── State ──────────────────────────────────────────────────
let array = [];
let maxVal = 100;
let isSorting = false;
let comparisons = 0;

// ─── DOM Refs ────────────────────────────────────────────────
const visualizer = document.getElementById('visualizer');
const algoSelect = document.getElementById('algorithm');
const sizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const sizeVal = document.getElementById('size-val');
const speedVal = document.getElementById('speed-val');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const customInput = document.getElementById('custom-input');
const applyCustomBtn = document.getElementById('apply-custom-btn');
const statusText = document.getElementById('status-text');
const comparisonsEl = document.getElementById('comparisons');

let paused = false;
let pauseCallback = null;

// Complexity display refs
const algoName = document.getElementById('algo-name');
const timeBest = document.getElementById('time-best');
const timeAvg = document.getElementById('time-avg');
const timeWorst = document.getElementById('time-worst');
const spaceEl = document.getElementById('space');

// ─── Complexity Data ─────────────────────────────────────────
const COMPLEXITY = {
    bubble: { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    selection: { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    insertion: { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    merge: { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    quick: { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
};

// ─── Utility: Sleep ──────────────────────────────────────────
// Converts speed slider (1-5) to ms delay (higher = slower)
const SPEED_MAP = { 1: 250, 2: 200, 3: 100, 4: 50, 5: 10 };
function sleep() {
    return new Promise(r => {
        setTimeout(() => {
            if (paused) {
                pauseCallback = r;
            } else {
                r();
            }
        }, SPEED_MAP[speedSlider.value]);
    });
}

// ─── Array Helpers ───────────────────────────────────────────
function generateArray() {
    const size = parseInt(sizeSlider.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    maxVal = Math.max(...array);
    comparisons = 0;
    updateComparisons();
    renderBars();
    setStatus('Ready — press ▶ Sort to begin.');
}

function renderBars() {
    visualizer.innerHTML = '';
    array.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(val / maxVal) * 100}%`;
        bar.textContent = val;
        bar.dataset.index = i;
        visualizer.appendChild(bar);
    });
}

function getBars() {
    return [...visualizer.querySelectorAll('.bar')];
}

// ─── Bar colour helpers ───────────────────────────────────────
function setColor(bars, indices, cls) {
    // Remove state classes from listed indices and apply new one
    const classes = ['comparing', 'swapping', 'sorted', 'pivot'];
    indices.forEach(i => {
        classes.forEach(c => bars[i].classList.remove(c));
        if (cls) bars[i].classList.add(cls);
    });
}

function resetColors(bars) {
    bars.forEach(b => b.classList.remove('comparing', 'swapping', 'sorted', 'pivot'));
}

function markSorted(bars, indices) {
    indices.forEach(i => {
        bars[i].classList.remove('comparing', 'swapping', 'pivot');
        bars[i].classList.add('sorted');
    });
}

function setBarHeight(bars, i, val) {
    bars[i].style.height = `${(val / maxVal) * 100}%`;
    bars[i].textContent = val;
}

// ─── Status & Comparisons ─────────────────────────────────────
function setStatus(msg) { statusText.textContent = msg; }
function updateComparisons() { comparisonsEl.textContent = `Comparisons: ${comparisons}`; }

function incComparisons() {
    comparisons++;
    updateComparisons();
}

// ─── Controls ─────────────────────────────────────────────────
function setControlsDisabled(disabled) {
    algoSelect.disabled = disabled;
    sizeSlider.disabled = disabled;
    speedSlider.disabled = disabled;
    generateBtn.disabled = disabled;
    startBtn.disabled = disabled;
    customInput.disabled = disabled;
    applyCustomBtn.disabled = disabled;
    pauseBtn.disabled = !disabled;
}

// ─── Complexity Display ───────────────────────────────────────
function updateComplexity() {
    const info = COMPLEXITY[algoSelect.value];
    algoName.textContent = info.name;
    timeBest.textContent = info.best;
    timeAvg.textContent = info.avg;
    timeWorst.textContent = info.worst;
    spaceEl.textContent = info.space;
}

// ─── Sorting Algorithms ───────────────────────────────────────

// 1. Bubble Sort
async function bubbleSort() {
    const bars = getBars();
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            setColor(bars, [j, j + 1], 'comparing');
            incComparisons();
            await sleep();

            if (array[j] > array[j + 1]) {
                // Swap
                setColor(bars, [j, j + 1], 'swapping');
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                setBarHeight(bars, j, array[j]);
                setBarHeight(bars, j + 1, array[j + 1]);
                await sleep();
            }
            setColor(bars, [j, j + 1], null);
        }
        markSorted(bars, [n - 1 - i]);
    }
    markSorted(bars, [0]);
}

// 2. Selection Sort
async function selectionSort() {
    const bars = getBars();
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        setColor(bars, [i], 'pivot');
        for (let j = i + 1; j < n; j++) {
            setColor(bars, [j], 'comparing');
            incComparisons();
            await sleep();
            if (array[j] < array[minIdx]) {
                if (minIdx !== i) setColor(bars, [minIdx], null);
                minIdx = j;
                setColor(bars, [minIdx], 'pivot');
            } else {
                setColor(bars, [j], null);
            }
        }
        if (minIdx !== i) {
            setColor(bars, [i, minIdx], 'swapping');
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            setBarHeight(bars, i, array[i]);
            setBarHeight(bars, minIdx, array[minIdx]);
            await sleep();
        }
        markSorted(bars, [i]);
    }
    markSorted(bars, [n - 1]);
}

// 3. Insertion Sort
async function insertionSort() {
    const bars = getBars();
    const n = array.length;
    markSorted(bars, [0]);
    for (let i = 1; i < n; i++) {
        const key = array[i];
        setColor(bars, [i], 'comparing');
        await sleep();
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            incComparisons();
            setColor(bars, [j], 'swapping');
            array[j + 1] = array[j];
            setBarHeight(bars, j + 1, array[j + 1]);
            await sleep();
            markSorted(bars, [j + 1]);
            j--;
        }
        incComparisons(); // final comparison that breaks the loop
        array[j + 1] = key;
        setBarHeight(bars, j + 1, key);
        markSorted(bars, [j + 1]);
    }
}

// 4. Merge Sort (top-down, animated via array writes)
async function mergeSort() {
    const bars = getBars();
    await mergeSortHelper(bars, 0, array.length - 1);
    markSorted(bars, [...Array(array.length).keys()]);
}

async function mergeSortHelper(bars, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(bars, left, mid);
    await mergeSortHelper(bars, mid + 1, right);
    await merge(bars, left, mid, right);
}

async function merge(bars, left, mid, right) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        setColor(bars, [k], 'comparing');
        incComparisons();
        await sleep();
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i++];
        } else {
            array[k] = rightArr[j++];
        }
        setBarHeight(bars, k, array[k]);
        setColor(bars, [k], null);
        k++;
    }
    while (i < leftArr.length) {
        setColor(bars, [k], 'swapping');
        await sleep();
        array[k] = leftArr[i++];
        setBarHeight(bars, k, array[k]);
        setColor(bars, [k], null);
        k++;
    }
    while (j < rightArr.length) {
        setColor(bars, [k], 'swapping');
        await sleep();
        array[k] = rightArr[j++];
        setBarHeight(bars, k, array[k]);
        setColor(bars, [k], null);
        k++;
    }
}

// 5. Quick Sort (Lomuto partition)
async function quickSort() {
    const bars = getBars();
    await quickSortHelper(bars, 0, array.length - 1);
    markSorted(bars, [...Array(array.length).keys()]);
}

async function quickSortHelper(bars, low, high) {
    if (low >= high) return;
    const pi = await partition(bars, low, high);
    markSorted(bars, [pi]);
    await quickSortHelper(bars, low, pi - 1);
    await quickSortHelper(bars, pi + 1, high);
}

async function partition(bars, low, high) {
    const pivot = array[high];
    setColor(bars, [high], 'pivot');
    let i = low - 1;

    for (let j = low; j < high; j++) {
        setColor(bars, [j], 'comparing');
        incComparisons();
        await sleep();
        if (array[j] <= pivot) {
            i++;
            setColor(bars, [i, j], 'swapping');
            [array[i], array[j]] = [array[j], array[i]];
            setBarHeight(bars, i, array[i]);
            setBarHeight(bars, j, array[j]);
            await sleep();
        }
        setColor(bars, [j], null);
        if (i >= 0 && i !== high) setColor(bars, [i], null);
    }
    // Place pivot in correct position
    setColor(bars, [i + 1, high], 'swapping');
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    setBarHeight(bars, i + 1, array[i + 1]);
    setBarHeight(bars, high, array[high]);
    await sleep();
    setColor(bars, [high], null);
    return i + 1;
}

// ─── Start Sorting ────────────────────────────────────────────
async function startSorting() {
    if (isSorting || array.length === 0) return;
    isSorting = true;
    comparisons = 0;
    updateComparisons();
    setControlsDisabled(true);

    const algo = algoSelect.value;
    setStatus(`Sorting with ${COMPLEXITY[algo].name}…`);

    const start = performance.now();

    switch (algo) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(); break;
        case 'quick': await quickSort(); break;
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    setStatus(`Done! ${COMPLEXITY[algo].name} completed in ${elapsed}s with ${comparisons} comparisons.`);

    isSorting = false;
    paused = false;
    pauseBtn.textContent = '⏸ Pause';
    setControlsDisabled(false);
    startBtn.disabled = true;
}

// ─── Event Listeners ─────────────────────────────────────────
generateBtn.addEventListener('click', () => {
    if (isSorting) return;
    generateArray();
    startBtn.disabled = false;
});

applyCustomBtn.addEventListener('click', () => {
    if (isSorting) return;
    const vals = customInput.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (vals.length > 0) {
        array = vals;
        maxVal = Math.max(...array);
        comparisons = 0;
        updateComparisons();
        renderBars();
        setStatus('Custom array loaded. Ready to sort.');
        startBtn.disabled = false;
    } else {
        alert('Please enter valid comma-separated numbers.');
    }
});

pauseBtn.addEventListener('click', () => {
    if (!isSorting) return;
    paused = !paused;
    pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause';
    if (!paused && pauseCallback) {
        pauseCallback();
        pauseCallback = null;
    }
});

startBtn.addEventListener('click', startSorting);

algoSelect.addEventListener('change', updateComplexity);

sizeSlider.addEventListener('input', () => {
    sizeVal.textContent = sizeSlider.value;
    if (!isSorting) {
        generateArray();
        startBtn.disabled = false;
    }
});

speedSlider.addEventListener('input', () => {
    const labels = { 1: 'Slowest', 2: 'Slow', 3: 'Medium', 4: 'Fast', 5: 'Fastest' };
    speedVal.textContent = labels[speedSlider.value];
});

// ─── Init ─────────────────────────────────────────────────────
updateComplexity();
generateArray();