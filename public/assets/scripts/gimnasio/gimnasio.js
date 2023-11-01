const action_iconsNP = `<div class="d-flex order-actions buttonsActions" bis_skin_checked="1">	
                                <a data-bs-toggle="modal" data-bs-target="#modalModificarPrecio"><i class="material-icons-two-tone">edit</i></a>
                            </div>`;


$(document).ready(async function () {


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    //INIXIALIZAR SELECT2
    var select2Concepto = $('#concepto_descuento').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Selecciona una opción',
        allowClear: true
    });

    var select2Tipo = $('#tipo_descuento').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Selecciona una opción',
        allowClear: true
    });


    //Bloquear fechas anteriores al día actual
    // Obtén el elemento input de tipo date
    const inputFecha = document.getElementById("fecha_vencimiento");

    // Obtiene la fecha actual en el formato "YYYY-MM-DD"
    const fechaActualVenc = new Date().toISOString().split("T")[0];

    // Establece la fecha mínima permitida en el campo de fecha
    inputFecha.setAttribute("min", fechaActualVenc);



    var tablaPrecios = $('#listaPreciosTable').DataTable({
        "initComplete": function (settings, json) {


        },
        dom: 'lrt',
        columns: [
            { data: 'secuencia', title: 'secuencia', visible: false },
            { data: 'id', title: 'id', visible: false },
            { data: 'concepto_pago', title: 'Concepto', width: '50%', visible: true },
            { data: 'precioFormatted', title: 'Precio', orderable: false, width: '35%' },
            { title: '', class: 'details-control', orderable: false, data: null, defaultContent: action_iconsNP, width: '15%' },
        ],
        autoWidth: false,
        search: {
            return: true,
        },
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
        },
        info: false,
        paging: false,
        targets: 'no-sort',
        bSort: true,
        order: [[0, 'asc']],

    });

    obtenerConceptos();


    const action_iconsPD = `<div class="d-flex order-actions buttonsActions" bis_skin_checked="1">	
                                    <a id="btnUpdDesc" data-bs-toggle="modal" data-bs-target="#modalAgregarDesc"><i class="material-icons-two-tone">edit</i></a>
                                    <a data-bs-toggle="modal" data-bs-target="#eliminarDescuento"><i class="material-icons-two-tone">delete</i></a>
                                </div>`;

    var tablaPromos = $('#listaPromosTable').DataTable({
        "initComplete": function (settings, json) {


        },
        'rowCallback': function (row, data, index) {
            if (data.status == 'false') {
                $(row).css('background-color', '#F8D7DA');
            }
        },
        columns: [
            { data: 'codigo_descuento', title: 'Código', width: '15%', visible: true },
            { data: 'usos_totales', title: 'Usos', width: '15%', visible: true },
            { data: 'formattConceptos', title: 'Concepto', width: '15%', visible: true },
            { data: 'formattTipo', title: 'Tipo', orderable: false, width: '15%' },
            { data: 'valor_descuento', title: 'Valor', orderable: false, width: '15%' },
            { class: 'details-control', orderable: false, data: null, defaultContent: action_iconsPD, width: '10%' },
        ],
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
        },
        info: false,
        paging: true,
        pageLength: 10,
        searching: true,
        pagingType: 'full_numbers',
        targets: 'no-sort',
        bSort: true,
        order: [[0, 'asc']],

    });

    obtenerDescuentos();

    var tablaPagos = $('#historialPagosTable').DataTable({
        "initComplete": function (settings, json) {

        },
        columns: [
            { data: 'fecha_pago', title: '', visible: false },
            { data: 'fecha', title: 'Fecha de pago', width: '15%', visible: true },
            { data: 'nombre_usuario', title: 'Usuario', width: '30%', visible: true },
            { data: 'pago_concepto', title: 'Concepto', width: '13%', visible: true },
            { data: 'metodo_pago_formatted', title: 'Método de pago', width: '13%', visible: true },
            { data: 'pago_inscripcion_text', title: 'Inscripción', width: '13%', visible: true },
            { data: 'precio_total', title: 'Total', width: '15%', orderable: true }
        ],
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
        },
        info: false,
        paging: true,
        pageLength: 10,
        searching: true,
        pagingType: 'full_numbers',
        targets: 'no-sort',
        bSort: true,
        order: [[0, 'desc']],

    });

    await obtenerPagos();

    async function obtenerConceptos() {

        tablaPrecios.clear().draw()

        var conceptos = await $.get('/gimnasio/obtener/conceptos');

        var nuevasRows = [];

        conceptos.orders.forEach(row => {
            row.precioFormatted = `$ ${row.precio_pago}`;
            nuevasRows.push(row)
        });

        tablaPrecios.rows.add(nuevasRows).draw();

    }

    $('#listaPreciosTable tbody').on('click', 'tr', function () {

        var datosFila = tablaPrecios.row(this).data();
        var indiceFila = tablaPrecios.row(this).index();

        $('#modalModificarPrecio').data(datosFila);

    });

    $('#modalModificarPrecio').on('shown.bs.modal', function () {

        let data = $('#modalModificarPrecio').data();
        $('#nuevo_precio').val(data.precio_pago);

    });

    $('#modificarPrecioForm').on('submit', async function (event) {

        event.preventDefault();

        const data = $('#modalModificarPrecio').data();

        const precio_pago = $('#nuevo_precio').val()

        await $.post('/gimnasio/actualizar/precio', { id: data.id, precio_pago });

        $('#modalModificarPrecio').modal('hide');

        obtenerConceptos();

    });


    $('#agregarDescForm').on('submit', async function (event) {

        event.preventDefault();

        const $form = $("#agregarDescForm");
        const data = getFormData($form);

        data.fecha_vencimiento_timestamp = data.fecha_vencimiento != '' ? obtenerTimestamp(data.fecha_vencimiento) : 4102466399;
        data.fecha_vencimiento = data.fecha_vencimiento != '' ? data.fecha_vencimiento : '2099-12-31';
        data.limite_usos = data.limite_usos != '' ? parseInt(data.limite_usos) : 999999;
        data.limite_usuario = data.limite_usuario != '' ? parseInt(data.limite_usuario) : 999999;
        data.valor_descuento = parseInt(data.valor_descuento);

        data.tipo_descuento = $('#tipo_descuento').val();

        const datosModal = $('#modalAgregarDesc').data();

        let state = '';
        let message = '';

        if (datosModal.id) {

            data.id = datosModal.id;

            const updDesc = await asyncPostAjax('/descuento/actualizar', data);

            state = updDesc.state;
            message = updDesc.message;

        } else {

            data.status = 'true';
            data.usos_actuales = 0;

            console.log({data});
            const postDesc = await asyncPostAjax('/descuento/agregar', data);

            state = postDesc.state;
            message = postDesc.message;

        }

        
        if (state = 'success') {

            $('#modalAgregarDesc').modal('toggle');

        }

        obtenerDescuentos();
        showNotification(state, message);

    });


    $('#btnSubmitAgregarDesc').on('click', async function (event) {

        $('#modalAgregarDesc').removeData();

    });


    $('#modalAgregarDesc').on('hide.bs.modal', function () {

        select2Tipo.val(null).trigger("change");
        select2Concepto.val(null).trigger("change");
        $("#nombre_descuento").val('');
        $("#codigo_descuento").val('');
        $("#valor_descuento").val('');
        $("#limite_usos").val('');
        $("#limite_usuario").val('');
        $("#fecha_vencimiento").val('');

    });


    $('#modalAgregarDesc').on('shown.bs.modal', function () {

        let data = $('#modalAgregarDesc').data();

        if (data.id) {

            select2Tipo.val(data.tipo_descuento).trigger("change");
            select2Concepto.val(data.concepto_descuento).trigger("change");
            $("#nombre_descuento").val(data.nombre_descuento);
            $("#codigo_descuento").val(data.codigo_descuento);
            $("#valor_descuento").val(data.valor_descuento);
            data.limite_usos != 999999 ? $("#limite_usos").val(data.limite_usos) : '';
            data.limite_usuario != 999999 ? $("#limite_usuario").val(data.limite_usuario) : '';
            data.fecha_vencimiento != '2099-12-31' ? $("#fecha_vencimiento").val(data.fecha_vencimiento) : '';

        }


    });


    function obtenerTimestamp(fechaInput) {

        // Crea un objeto Date a partir del valor del campo de entrada
        const fechaObjeto = new Date(fechaInput);

        // Obtiene el desplazamiento horario (offset) en minutos
        const offset = fechaObjeto.getTimezoneOffset();

        // Ajusta la fecha restando el desplazamiento horario en minutos
        fechaObjeto.setMinutes(fechaObjeto.getMinutes() - offset);

        // Obtén el timestamp en milisegundos (milisegundos desde el 1 de enero de 1970)
        const timestamp = fechaObjeto.getTime();

        return timestamp;
    }

    async function obtenerDescuentos() {

        var infinito = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-infinity" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.0" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
            </svg>`;

        let mapConceptos = {
            'inscripcion': 'Inscripción',
            'todos_conceptos': 'Todos',
            'diario': 'Diario',
            'semanal': 'Semanal',
            'mensual': 'Mensual',
            'bimestral': 'Bimestral',
            'semestral': 'Semestral',
            'anual': 'Anual',
        }

        let mapTipos = {
            'precio_fijo': 'Precio fijo',
            'porcentaje': 'Porcentaje',
            'descontar_cantidad': 'Descontar cantidad',
        }

        tablaPromos.clear().draw()

        var descuentos = await $.get('/gimnasio/obtener/descuentos');

        for (const row of descuentos.desc) {

            row.usos_totales = row.limite_usos == 999999 ? `${row.usos_actuales} / ${infinito}` : `${row.usos_actuales} / ${row.limite_usos}`
            row.formattTipo = mapTipos[row.tipo_descuento]
            row.formattConceptos = mapConceptos[row.concepto_descuento]

        }

        tablaPromos.rows.add(descuentos.desc).draw();

    }


    $('#listaPromosTable tbody').on('click', 'tr', function () {

        var datosFila = tablaPromos.row(this).data();
        var indiceFila = tablaPromos.row(this).index();

        $('#eliminarDescuento').data(datosFila);

        $('#modalAgregarDesc').data(datosFila);

    });

    $("#btnEliminarDescuento").click(async function () {

        let datos = $('#eliminarDescuento').data();

        const delDesc = await asyncPostAjax('/gimnasio/eliminar/descuentos', { id: datos.id });


        if (delDesc.state = 'success') {

            showNotification(delDesc.state, delDesc.message);
            obtenerDescuentos();

        }

    });


    async function obtenerPagos() {

        tablaPagos.clear().draw()

        var pagos = await $.get('/gimnasio/obtener/pagos');

        var nuevasRows = [];

        let rows = 1;


        let metodosPagoMap = {
            deposito : 'Depósito',
            tarjeta : 'Tarjeta',
            efectivo : 'Efectivo'
        }

        for (const row of pagos.orders) {

            var dataUser = await $.post('/usuarios/consultar/', { id: row.id_usuario });

            if (row.pago_inscripcion == 'true') {
                row.pago_inscripcion_text = 'Sí'
            } else {
                row.pago_inscripcion_text = 'No'
            }


            row.metodo_pago_formatted = metodosPagoMap[row.metodo_pago];    

            row.nombre_usuario = dataUser.datos ? dataUser.datos.nombre_usuario : row.nombre_usuario;

            row.fecha = toDateWHours(row.fecha_pago);

            nuevasRows.push(row)

        };

        tablaPagos.rows.add(nuevasRows).draw();

    }



    $('#concepto_descuento').on('select2:select', function (e) {

        var opcionSeleccionada = e.params.data.id;

        if (opcionSeleccionada == 'todos_conceptos') {

            $('#tipo_descuento').val('porcentaje').trigger('change.select2');
            $('#tipo_descuento').prop('disabled', true);

        } else {

            $('#tipo_descuento').prop('disabled', false);

        }


    });




    function toDate(timestamp) {
        // Crear un objeto de fecha a partir del timestamp en milisegundos
        const fechaObjeto = new Date(timestamp);

        // Obtener los componentes de la fecha
        const dia = String(fechaObjeto.getDate()).padStart(2, '0'); // Agregar ceros a la izquierda si el día es menor a 10
        const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, se suma 1 y se agregan ceros a la izquierda si el mes es menor a 10
        const anio = fechaObjeto.getFullYear();

        // Formatear la fecha como DD/MM/YYYY
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        return fechaFormateada;
    }


    function toDateWHours(timestamp) {
        const date = new Date(timestamp);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son base 0, por eso se suma 1
        const year = date.getFullYear().toString().substr(-2); // Tomar los últimos 2 dígitos del año
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate;
    }





    function getFormData($form) {

        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {

            indexed_array[n['name']] = n['value'].trim();

        });

        return indexed_array;

    }

    async function asyncPostAjax(path, data,) {

        return await $.ajax({

            type: 'POST',
            url: path,
            data: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (result) {

                return result;

            },

        });

    }

    async function asyncGetAjax(path) {

        return await $.ajax({

            type: 'GET',
            url: path,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (result) {

                return result;

            },

        });

    }


})
