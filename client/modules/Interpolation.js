/**
 * Класс для линейной интерполяции по времени
 */
export default class Interpolation {
    /**
     * @param {Object} start Начальная точка - объект с полями values и time
     * @param {Object} end Конечная точка - объект с полями values и time
     */
    constructor(start, end) {
        this._start = start || {values: [], time: 0};
        this._end = end || {values: [], time: 0};
        this._coefficients = [];
        this._offsets = [];

        const delta = start.time - end.time;

        for (let i = 0; i < this._start.values.length; i++) {
            this._coefficients[i] = delta ? (start.values[i] - end.values[i]) / delta : 0;
            this._offsets[i] = start.values[i] - this._coefficients[i] * start.time;
        }
    }

    /**
     * Получение значения в точке в заданном времени
     * @param {Number} currentTime
     * @returns {?Array}
     */
    step(currentTime) {
        if (this._start.time >= currentTime || this._end.time <= currentTime) {
            return null;
        }

        const result = [];

        for (let i = 0; i < this._coefficients.length; i++) {
            result[i] = this._coefficients[i] * currentTime + this._offsets[i];
        }

        return result;
    }
}
