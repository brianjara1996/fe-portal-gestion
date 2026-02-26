const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
]

const DateToDay = () => {
    const today = new Date();
    const date = today.getDate() + " de " + MONTHS[today.getMonth()] + " de " + today.getFullYear();
    return (
        <div style={{ fontSize: "12px" }}>{date}</div>
    );
}

export default DateToDay;