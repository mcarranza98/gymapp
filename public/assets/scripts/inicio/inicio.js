$(document).ready(async function () {

    calcularUsuariosActivos();
    calcularUsuariosNoRenovados();
    calcularUltimosMesesUsuarios();


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



})

/*


Zibak Rubio




*/
