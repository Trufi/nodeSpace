export default function() {
    const hrtime = process.hrtime();

    return (hrtime[0] + hrtime[1] / 1e9) * 1000;
}
