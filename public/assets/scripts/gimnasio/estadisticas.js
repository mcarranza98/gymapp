calcularIngresosMensuales();
calcularUltimosMesesIngresos();
calcularUsuariosActivos();
calcularUltimosMesesUsuarios();
calcularIngresosAnuales();
calcularUsuariosNoRenovados();


async function calcularUsuariosActivos() {

    var fechaActual = new Date();
    var timestamp = fechaActual.getTime();

    var usuarios = await $.post('/gimnasio/usuarios/activos', { fechaActual: timestamp });

    let timestamps = obtenerTimestampsMesActual();

    var usuariosUnicos = await $.post('/gimnasio/usuarios/mensual', {
        fechaInicio: timestamps.inicio,
        fechaFin: timestamps.fin
    });


    $('#usuariosUnicosMes').text(`${usuariosUnicos.resultados.length} únicos este mes`);
    $('#cantUsuariosActivos').text(usuarios.resultados.length);

}

//Estadisticas de ingresos de los ultimos 4 meses
async function calcularUltimosMesesIngresos() {

    // Ejemplo de uso
    const mesesYFechas = obtenerUltimosMeses(4);

    let meses = [];
    let valores = [];
    let timestamps = [];

    for (let i = mesesYFechas.length - 1; i >= 0; i--) {

        const elemento = mesesYFechas[i];

        meses.push(elemento.mes);

        var pagos = await $.post('/gimnasio/ingreso/intervalo', { fechaInicio: elemento.fechaInicio, fechaFin: elemento.fechaFin });

        let ingresosTotales = 0.0;
        pagos.resultados.forEach(pago => {

            let monto = pago.precio_total;
            monto = parseFloat(monto.replace('$', ''));
            ingresosTotales += monto;


        });

        valores.push(ingresosTotales)

    }

    var ctx = document.getElementById('ingresosMensualesGrafico').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Usuarios mensuales',
                data: valores,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}


async function calcularUsuariosNoRenovados() {

    const mesesYFechas = obtenerUltimosMeses(3);

    console.log({ mesesYFechas });

    let fechaInicio = mesesYFechas[2].fechaInicio;
    let fechaFin = mesesYFechas[0].fechaFin;

    console.log(fechaInicio, fechaFin);

    var pagos = await $.post('/usuarios/inactivos', { fechaInicio, fechaFin });

    console.log({ pagos: pagos });

    $('#cantUsuariosNoRenovados').text(pagos.resultados.length);
    $('#periodoNoRenovados').text(`Periodo ${mesesYFechas[2].mes} - ${mesesYFechas[0].mes}`);

}

async function calcularIngresosAnuales() {


    const timestamps = obtenerTimestampsAnoActual();

    let fechaInicio = timestamps.inicio * 1000;
    let fechaFin = timestamps.fin * 1000;

    var pagos = await $.post('/gimnasio/ingreso/intervalo', { fechaInicio, fechaFin });

    let ingresosTotales = 0.0;
    pagos.resultados.forEach(pago => {

        let monto = pago.precio_total;
        monto = parseFloat(monto.replace('$', ''));
        ingresosTotales += monto;


    });



    $('#cantMovimientosAnual').text(`${pagos.resultados.length} movimientos`);
    $('#ingAnualesSpan').text(`${formatearComoMoneda(ingresosTotales)}`);


}

//Estadisticas de usuarios unicos de los ultimos 4 meses
async function calcularUltimosMesesUsuarios() {

    // Ejemplo de uso
    const mesesYFechas = obtenerUltimosMeses(4);

    let meses = [];
    let valores = [];
    let timestamps = [];

    for (let i = mesesYFechas.length - 1; i >= 0; i--) {

        const elemento = mesesYFechas[i];

        meses.push(elemento.mes);

        var usuarios = await $.post('/gimnasio/usuarios/mensual', { fechaInicio: elemento.fechaInicio, fechaFin: elemento.fechaFin });

        valores.push(usuarios.resultados.length)

    }

    var ctx = document.getElementById('usuariosActivosGrafico').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Usuarios mensuales',
                data: valores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

//Sección de ingresos mensuales
async function calcularIngresosMensuales() {

    const timestamps = obtenerTimestampsMesActual();

    let fechaInicio = timestamps.inicio;
    let fechaFin = timestamps.fin;

    var pagos = await $.post('/gimnasio/ingreso/intervalo', { fechaInicio, fechaFin });

    let ingresosTotales = 0.0;
    pagos.resultados.forEach(pago => {

        let monto = pago.precio_total;
        monto = parseFloat(monto.replace('$', ''));
        ingresosTotales += monto;


    });

    $('#cantMovimientos').text(`${pagos.resultados.length} movimientos`);
    $('#ingMensualesSpan').text(`${formatearComoMoneda(ingresosTotales)}`);
}

//Función que regresa regresa los timestamps de los ultimos 4 meses
function obtenerUltimosMeses(cantidadMeses) {
    const hoy = new Date();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const resultados = [];

    for (let i = 0; i < cantidadMeses; i++) {
        const mesActual = hoy.getMonth() - i;
        const fechaInicio = new Date(hoy.getFullYear(), mesActual, 1);
        const fechaFin = new Date(hoy.getFullYear(), mesActual + 1, 0, 23, 59, 59, 999);

        resultados.push({
            mes: meses[mesActual],
            fechaInicio: fechaInicio.getTime(),
            fechaFin: fechaFin.getTime()
        });
    }

    return resultados;
}

function obtenerTimestampsMesActual() {
    const ahora = new Date(); // Obtenemos la fecha actual
    const primerDiaDelMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1); // Primer día del mes actual
    const ultimoDiaDelMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0); // Último día del mes actual

    const inicioDelMesTimestamp = primerDiaDelMes.getTime(); // Timestamp del inicio del mes
    const finDelMesTimestamp = ultimoDiaDelMes.getTime() + 86399999; // Timestamp del final del mes (23:59:59.999)

    return {
        inicio: inicioDelMesTimestamp,
        fin: finDelMesTimestamp
    };
}


function obtenerTimestampsAnoActual() {
    const fechaActual = new Date();
    const inicioDelAnio = new Date(fechaActual.getFullYear(), 0, 1); // 0 representa enero
    const finalDelAnio = new Date(fechaActual.getFullYear(), 11, 31); // 11 representa diciembre

    const timestampInicio = inicioDelAnio.getTime() / 1000; // Divide por 1000 para obtener el timestamp en segundos
    const timestampFinal = finalDelAnio.getTime() / 1000; // Divide por 1000 para obtener el timestamp en segundos

    return {
        inicio: timestampInicio,
        final: timestampFinal
    };
}


function formatearComoMoneda(numero) {
    // Verifica si el número tiene decimales
    const tieneDecimales = numero % 1 !== 0;

    // Configuración para el formato de moneda
    const formatoMoneda = {
        style: 'currency',
        currency: 'USD', // Puedes cambiar esto a la moneda que desees
        minimumFractionDigits: tieneDecimales ? 2 : 0, // Muestra 2 decimales si hay, de lo contrario, muestra 0
        maximumFractionDigits: tieneDecimales ? 2 : 0, // Muestra 2 decimales si hay, de lo contrario, muestra 0
    };

    // Formatea el número como moneda y agrega el símbolo y el espacio
    return '' + numero.toLocaleString('en-US', formatoMoneda);
}

