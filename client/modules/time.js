let time;

if (performance && performance.now) {
    time = performance.now.bind(performance);
} else {
    time = Date.now.bind(Date);
}

export {time as default};
