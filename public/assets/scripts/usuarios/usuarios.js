

const action_iconsNP = `<div class="d-flex order-actions buttonsActions" bis_skin_checked="1">	
<a id="btnModificarUsuario"><i class="material-icons-two-tone">edit</i></a>
<a data-bs-toggle="modal" data-bs-target="#registrarPago"><i class="material-icons-two-tone">payments</i></a>
<a href="/usuarios"><i class="material-icons-two-tone">fingerprint</i></a>
<a data-bs-toggle="modal" data-bs-target="#eliminarUsuario"><i class="material-icons-two-tone">delete</i></a>
</div>`;



$(document).ready(function () {


    //INICIALIZAR SELECT2
    var select2Codigos = $('.select2-codigos-descuentos').select2();
    var select2Modalidad = $('#selectModalidadPago').select2({
        minimumResultsForSearch: Infinity,
        placeholder: 'Selecciona una opción',
        allowClear: true
    });


    obtenerDescuentos()


    async function obtenerDescuentos() {

        var { desc } = await $.get('/gimnasio/obtener/descuentos');

        select2Codigos.empty();

        for (var i = 0; i < desc.length; i++) {

            var opcion = desc[i];

            console.log({ desc: desc[i] });
            if (desc[i].status == 'true') {

                var optionElement = $('<option>').val(opcion.id).text(opcion.codigo_descuento);
                select2Codigos.append(optionElement);

            }


        }

    }

    busqueda = window.location.search;

    if (busqueda == '?agregar-usuario') {
        var modal = new bootstrap.Modal(document.getElementById("agregarUsuario"));
        modal.show();
    }



    var tablaUsuarios = $('#usuariosTable').DataTable({
        "initComplete": function (settings, json) {


        },
        columns: [

            { data: 'nombre_usuario', title: 'Nombre', width: '30%' },
            { data: 'modalidad_actual', title: 'Modalidad', width: '15%' },
            { data: 'sig_pago', title: 'Sig. Pago', orderable: false, width: '15%' },
            //{ data: 'sig_pago_timestamp', title: 'Adeudo', orderable: false, width: '20%' },
            { title: 'Opciones', class: 'details-control', orderable: false, defaultContent: action_iconsNP, data: null, width: '20%' },
        ],
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json',
        },
        info: true,
        paging: true,
        searching: true,
        pagingType: 'full_numbers',
        targets: 'no-sort',
        bSort: true,
        order: [[0, 'asc']],

    });





    async function resetTablaUsuarios() {

        tablaUsuarios.clear().draw()

        const { res } = await asyncGetAjax('/usuarios/cargar');

        const datosTabla = [];

        res.forEach(element => {
            datosTabla.push(element);
        });

        tablaUsuarios.rows.add(datosTabla).draw();
    }

    resetTablaUsuarios()


    $('#agregarUsuarioForm').submit(async function (event) {
        event.preventDefault();

        const { isValidado, mensajeValidacion } = validarAgregarUSuarios();

        if (isValidado) {


            const $form = $("#agregarUsuarioForm");
            const data = getFormData($form);

            let today = Date.now();
            let todayFormat = toDate(today);

            const fecha_ingreso_timestamp = toTimestamp(todayFormat);

            data.fecha_ingreso_timestamp = fecha_ingreso_timestamp;

            //const { sig_pago, sig_pago_timestamp } = sigPago(data.modalidad, fecha_ingreso_timestamp);

            data.fecha_ingreso = todayFormat;
            data.sig_pago = todayFormat;
            data.sig_pago_timestamp = fecha_ingreso_timestamp;
            data.modalidad_actual = 'Sin definir';

            try {

                let datos = $('#agregarUsuario').data();

                let datosLength = Object.keys(datos).length

                if (datosLength == 0) {

                    const postUser = await asyncPostAjax('/usuarios/agregar', data);



                    if (postUser.state = 'success') {

                        $('#agregarUsuario').modal('toggle');
                        limpiarAgregarUsuario();
                        showNotification(postUser.state, postUser.message);
                        resetTablaUsuarios()

                    }

                } else {

                    data.id = datos.id;

                    console.log('actualizar');

                    const actUser = await asyncPostAjax('/usuarios/actualizar', data);

                    if (actUser.state = 'success') {

                        $('#agregarUsuario').modal('toggle');
                        limpiarAgregarUsuario();
                        showNotification(actUser.state, actUser.message);
                        resetTablaUsuarios()

                    }

                }



            } catch (e) {

                console.log(e);

            }

        } else {
            showNotification('warning', mensajeValidacion);
        }

    });


    $('#agregarUsuario').on('hidden.bs.modal', function () {

        limpiarAgregarUsuario();

    });

    $('#registrarPago').on('hidden.bs.modal', function () {

        $(this).removeData();

    });


    $('#selectModalidadPago').change(async function () {
        // This code will be executed when the value of the select element changes
        var selectedValue = $(this).val();

        if (selectedValue != '') {
            const precioConcepto = await asyncPostAjax('/gimnasio/concepto/info', { id: selectedValue });

            let precio = precioConcepto.concepto.precio_pago;

            $('#precioModalidad').html(`$${precio.toFixed(2)}`);

            sumarPago()
        }

    });

    $('#checkInscripcionPago').change(async function () {
        if ($(this).is(':checked')) {

            let value = $(this).val();
            const precioConcepto = await asyncPostAjax('/gimnasio/concepto/info', { id: value });

            let precio = precioConcepto.concepto.precio_pago;

            $('#precioInscripcion').html(`$${precio.toFixed(2)}`);

            sumarPago()

        } else {

            $('#precioInscripcion').html(`$00.00`);

            sumarPago()
        }
    });

    function sumarPago() {

        let precioModalidad = $('#precioModalidad').text();
        let precioInscripcion = $('#precioInscripcion').text();

        precioModalidad = parseFloat(precioModalidad.split('$')[1]);
        precioInscripcion = parseFloat(precioInscripcion.split('$')[1]);

        let precioTotal = precioInscripcion + precioModalidad;

        $('#totalCobro').html(`$${precioTotal.toFixed(2)}`);

    }


    $('#pagoUsuario').submit(async function (event) {
        event.preventDefault();

        const $form = $("#pagoUsuario");
        const data = getFormData($form);
        let dataModal = $('#registrarPago').data();
        data.pago_inscripcion = data.pago_inscripcion ? 'true' : 'false';

        if (data.pago_modalidad) {
            const tipoConcepto = await asyncPostAjax('/gimnasio/concepto/info', { id: data.pago_modalidad });
            let precio = tipoConcepto.concepto.concepto_pago;
            data.pago_concepto = precio;
        }

        var valoresSeleccionados = $('.select2-codigos-descuentos').val();
        data.descuentos_aplicados = JSON.stringify(valoresSeleccionados);
        data.fecha_pago = Date.now();
        data.precio_modalidad = $('#precioModalidad').text();
        data.precio_inscripcion = $('#precioInscripcion').text();
        data.precio_total = $('#totalCobro').text();
        data.descuento_inscripcion = '$0.00';
        data.descuento_modalidad = '$0.00';
        data.nombre_usuario = dataModal.nombre_usuario;
        data.id_usuario = dataModal.id;

        if (valoresSeleccionados.length > 0) {
            await asyncPostAjax('/gimnasio/actualizar/descuento', { id: valoresSeleccionados });
        }

        try {

            var infoSigPago = sigPago(data.pago_concepto, data.fecha_pago);

            data.fecha_sig_pago = infoSigPago.sig_pago_timestamp;
            const postPago = await asyncPostAjax('/pagos/agregar', data);

            if (postPago.state = 'success') {

                $('#registrarPago').modal('toggle');
                showNotification(postPago.state, postPago.message);
                //resetTablaUsuarios()

                //ACTUALIZAR LA INFORMACIÓN DEL USUARIO



                var datosUser = {
                    id: dataModal.id,
                    modalidad_actual: data.pago_concepto,
                    sig_pago: infoSigPago.sig_pago,
                    sig_pago_timestamp: infoSigPago.sig_pago_timestamp
                }

                let actUser = await asyncPostAjax('/usuario/actualizar/pago', datosUser);

                resetTablaUsuarios()
            }


        } catch (e) {

            console.log(e);

        }

    });


    $('.select2-codigos-descuentos').on('select2:select', async function (e) {

        var opcionSeleccionada = e.params.data;

        const infoDesc = await asyncPostAjax('/gimnasio/obtener/descuento', { id: opcionSeleccionada.id });

        let precioInsc = $('#precioInscripcion').html();
        let precioMod = $('#precioModalidad').html();

        precioInsc = parseFloat(precioInsc.replace('$', ''));
        precioMod = parseFloat(precioMod.replace('$', ''));

        console.log({ infoDesc });

        let dataModal = $('#registrarPago').data();

        //Detecta sí el descuento aplicado es por inscripción
        if (infoDesc.desc.concepto_descuento == 'inscripcion') {

            //Revisa que este seleccionado el checkbox de inscripción, sino esta seleccionado no deja aplicar el descuento
            var isChecked = $('#checkInscripcionPago').is(':checked');

            if (!isChecked) {

                showNotification('warning', 'Debes de tener la inscripción seleccionada para aplicar un descuento por inscripción');
                quitarUltimoDescuento('select2-codigos-descuentos');

            } else {

                //Sí el decuento es aplicado revisa si el modal tiene registro de un descuento del mismo tipo aplicado previamente
                if (dataModal.concepto_inscripcion) {
                    //en caso de encontrar que ya hay un descuento de este tipo no deja aplicar el segundo
                    showNotification('warning', 'ya existe inscripción');

                    quitarUltimoDescuento('select2-codigos-descuentos')


                } else {

                    //Sí no hay un descuento de este tipo ya aplicado pone los datos del mismo en el modal
                    $('#registrarPago').data({ concepto_inscripcion: true });

                    let precioFinal = 0;
                    if (infoDesc.desc.tipo_descuento == "descontar_cantidad") {

                        let valor_descuento = infoDesc.desc.valor_descuento;
                        precioFinal = precioInsc - valor_descuento;

                    } else if (infoDesc.desc.tipo_descuento == "porcentaje") {

                        let valor_descuento = infoDesc.desc.valor_descuento;
                        precioFinal = precioInsc - (precioInsc * (valor_descuento / 100));

                    } else if (infoDesc.desc.tipo_descuento == "precio_fijo") {

                        let valor_descuento = infoDesc.desc.valor_descuento;
                        precioFinal = valor_descuento;

                    }

                    $('#precioInscripcion').html(`$${precioFinal}`);
                    sumarPago()

                }


            }

        } else {

            //En caso de que el descuento no sea por isncripción, las modalidades hacen el mismo proceso de verficar si ya existe
            //algún descuento previo de este tipo
            var isSelected = $('#selectModalidadPago').val();
            console.log({ isSelected });

            if (isSelected == '') {

                showNotification('warning', 'Debes de tener una modalidad seleccionada para aplicar un descuento por modalidad');

                quitarUltimoDescuento('select2-codigos-descuentos');

            } else {

                if (dataModal.concepto_reingreso) {

                    showNotification('warning', 'ya existe reingreso');
                    quitarUltimoDescuento('select2-codigos-descuentos')

                } else {

                    console.log('no existe reingreso');

                    const infoDesc = await asyncPostAjax('/gimnasio/obtener/descuento', { id: opcionSeleccionada.id });
                    const infoConc = await asyncPostAjax('/gimnasio/concepto/info', { id: isSelected });

                    console.log({ infoDesc });
                    console.log({ infoConc });


                    let tipo_concepto = infoConc.concepto.concepto_pago;
                    let tipo_descuento = infoDesc.desc.concepto_descuento;
                    let modo_descuento = infoDesc.desc.tipo_descuento;
                    let valor_descuento = infoDesc.desc.valor_descuento;


                    let precioFinal = 0;
                    const descuentoConceptoMap = {
                        'diario': 'Día',
                        'semanal': 'Semana',
                        'mensual': 'Mes',
                        'bimestral': 'Bimestre',
                        'semestral': 'Semestre',
                        'anual': 'Año'
                    };

                    if (tipo_descuento === 'todos_conceptos') {

                        precioFinal = precioMod - (precioMod * (valor_descuento / 100));
                        $('#precioModalidad').html(`$${precioFinal}`);
                        sumarPago()
                        $('#registrarPago').data({ concepto_reingreso: true });

                    } else if (descuentoConceptoMap[tipo_descuento] === tipo_concepto) {

                        calcularModalidadCDes(modo_descuento, valor_descuento, precioMod);
                        $('#registrarPago').data({ concepto_reingreso: true });

                    } else {

                        showNotification('warning', 'Este tipo de descuento no es compatible con esta modalidad.');
                        quitarUltimoDescuento('select2-codigos-descuentos');

                    }

                }

            }

        }


    });

    $('.select2-codigos-descuentos').on('select2:unselect', async function (e) {

        var opcionSeleccionada = e.params.data;

        let modalData = $('#registrarPago').data();

        var isSelected = $('#selectModalidadPago').val();
        var isChecked = $('#checkInscripcionPago').is(':checked');

        const infoDesc = await asyncPostAjax('/gimnasio/obtener/descuento', { id: opcionSeleccionada.id });
        const infoConc = await asyncPostAjax('/gimnasio/concepto/info', { id: isSelected });
        const infoInsc = await asyncPostAjax('/gimnasio/concepto/info', { id: 'f109714f-563c-48ae-9df1-5ecc7e3236e1' });

        if (isChecked) {

            if (modalData.concepto_inscripcion && infoDesc.desc.concepto_descuento == "inscripcion") {

                $('#precioInscripcion').html(`$${infoInsc.concepto.precio_pago}`);
                $('#registrarPago').data({ concepto_inscripcion: false });
                sumarPago()

            }

        }

        if (isSelected != '') {

            if (modalData.concepto_reingreso) {

                $('#precioModalidad').html(`$${infoConc.concepto.precio_pago}`);
                $('#registrarPago').data({ concepto_reingreso: false });
                sumarPago()

            }

        }


        /*
        faltantes de descuentos:
        agregar la información de uso al cupón al hacer submit
        si quitas y vuelves a poner una modalidad o reinscripción aparece el mensaje de que ya existe un cupón
        si ya hay cupones seleccionados y cambias de modalidad que la nueva modalidad de aplique con la oferta
        
        si pones un cupón de cualquier tipo bloquear el select o el check para evitar cambios
        
        */


    });


    function quitarUltimoDescuento(claseSelect2) {
        // Obtener todas las opciones seleccionadas
        var selectedOptions = $(`.${claseSelect2}`).val();

        // Obtener la última opción seleccionada
        var lastSelectedOption = selectedOptions[selectedOptions.length - 1];

        // Quitar la última opción seleccionada
        var removedOption = $(`.${claseSelect2}`).find('option[value="' + lastSelectedOption + '"]');
        removedOption.prop('selected', false);

        // Actualizar Select2 para reflejar el cambio
        $(`.${claseSelect2}`).trigger('change.select2');
    }


    function calcularModalidadCDes(modo_descuento, valor_descuento, precioMod) {

        let precioFinal = 0;
        if (modo_descuento == "descontar_cantidad") {

            precioFinal = precioMod - valor_descuento;

        } else if (modo_descuento == "porcentaje") {

            precioFinal = precioMod - (precioMod * (valor_descuento / 100));

        } else if (modo_descuento == "precio_fijo") {

            precioFinal = valor_descuento;

        }

        $('#precioModalidad').html(`$${precioFinal}`);
        sumarPago()

    }


    //LLIMPIAR MODAL DE PAGO AL CERRARLO

    $('#registrarPago').on('hide.bs.modal', function () {

        select2Modalidad.val(null).trigger("change");
        select2Codigos.val(null).trigger("change");
        $("#checkInscripcionPago").prop("checked", false);

    });

    $("#btnAgregarUsuario").click(function () {

        console.log("Se hizo clic en el botón 'btnAgregarUsuario'");

        $('#agregarUsuario').removeData();

        console.log($('#agregarUsuario').data())


    });

    $("#usuariosTable").on("click", "#btnModificarUsuario", function () {

        let datos = $('#agregarUsuario').data();

        console.log(datos);
        $('#nombre_usuario').val(datos.nombre_usuario);
        $('#telefono_usuario').val(datos.telefono_usuario);
        $('#nombre_contacto').val(datos.nombre_contacto);
        $('#telefono_contacto').val(datos.telefono_contacto);
        $('#fecha_nacimiento').val(datos.fecha_nacimiento);

        if (datos.radio_sexo == 'hombre') {
            $('#radio_sexo1').prop('checked', true);
        } else {
            $('#radio_sexo2').prop('checked', true);
        }



        $('#agregarUsuario').modal('show');

    });

    $('#registrarPago').on('shown.bs.modal', function () {

        let datos = $('#registrarPago').data();
        obtenerDescuentos()

        console.log(datos);

        if (datos.fecha_ingreso == datos.sig_pago) {
            $('#checkInscripcionPago').prop('disabled', false);
        } else {
            $('#checkInscripcionPago').prop('disabled', true);
        }

        console.log('abierto');

    });












    //FUNCIONES GLOBALES

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



    function toTimestamp(fecha) {
        // Obtener los componentes de la fecha
        const partesFecha = fecha.split('/');
        const dia = partesFecha[0];
        const mes = partesFecha[1] - 1; // Los meses en JavaScript comienzan desde 0 (enero es 0, febrero es 1, etc.)
        const anio = partesFecha[2];

        // Crear un objeto de fecha
        const fechaObjeto = new Date(anio, mes, dia);

        // Obtener el timestamp en milisegundos
        const timestamp = fechaObjeto.getTime();

        return timestamp;
    }

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

    function sigPago(modalidad, timestamp) {
        let tiempo_pagado = 0;
        var sig_pago_timestamp = 0;
        var sig_pago = 0;
        switch (modalidad) {
            case 'Día':

                tiempo_pagado = 24 * 60 * 60 * 1000;
                sig_pago_timestamp = timestamp + tiempo_pagado;
                sig_pago = toDate(sig_pago_timestamp);

                break;
            case 'Semana':

                tiempo_pagado = 7 * 24 * 60 * 60 * 1000;
                sig_pago_timestamp = timestamp + tiempo_pagado;
                sig_pago = toDate(sig_pago_timestamp);


                break;
            case 'Mes':

                sig_pago_timestamp = sumarMesesTimestamp(timestamp, 1);
                sig_pago = toDate(sig_pago_timestamp);


                break;
            case 'Bimestre':

                sig_pago_timestamp = sumarMesesTimestamp(timestamp, 2);
                sig_pago = toDate(sig_pago_timestamp);


                break;
            case 'Semestre':

                sig_pago_timestamp = sumarMesesTimestamp(timestamp, 6);
                sig_pago = toDate(sig_pago_timestamp);


                break;
            case 'Año':

                sig_pago_timestamp = sumarMesesTimestamp(timestamp, 12);
                sig_pago = toDate(sig_pago_timestamp);


                break;
            default:



                break;
        }

        return { sig_pago, sig_pago_timestamp };



    }


    function cantidadDiaEnMes(timestamp) {
        const fecha = new Date(timestamp);
        const mes = fecha.getMonth();
        const anio = fecha.getFullYear();

        const primerDiaMes = new Date(anio, mes, 1);
        const ultimoDiaMes = new Date(anio, mes + 1, 0);

        const cantidadDias = ultimoDiaMes.getDate();

        return cantidadDias;
    }

    function sumarMesesTimestamp(timestamp, cantidadMeses) {
        const fecha = new Date(timestamp);
        const dia = fecha.getDate();
        const mes = fecha.getMonth();
        const anio = fecha.getFullYear();

        const nuevaFecha = new Date(anio, mes + cantidadMeses, dia);
        const nuevoTimestamp = nuevaFecha.getTime();

        return nuevoTimestamp;
    }


    function limpiarAgregarUsuario() {

        $('#nombre_usuario').val('');
        $('#nombre_contacto').val('');
        $('#telefono_usuario').val('');
        $('#telefono_contacto').val('');
        $('#fecha_nacimiento').val('');
        $('#radio_sexo1').prop('checked', false);
        $('#radio_sexo2').prop('checked', false);
        //$('#modalidad').val('default');
        //$('#fecha_ingreso').data('daterangepicker').setStartDate(moment());
        //$('#fecha_nacimiento').data('daterangepicker').setStartDate(moment());

    }

    function validarAgregarUSuarios() {

        isValidado = true;
        mensajeValidacion = '';

        var checked = $('input[name="radio_sexo"]:checked').length > 0;
        if (checked) {
            mensajeValidacion = 'Debes de llenar todos los campos personales y de facturación.'
        } else {
            isValidado = false;
        }


        /*if ($('#modalidad').val() == 'default') {
        isValidado = false;
        mensajeValidacion = 'Debes de llenar todos los campos personales y de facturación.'
        }*/


        if ($('#nombre_usuario').val() == '' || $('#nombre_usuario').val() == '') {
            isValidado = false;
            mensajeValidacion = 'Debes de llenar todos los campos personales y de facturación.'
        }


        return { isValidado, mensajeValidacion };

    }

    $('#usuariosTable tbody').on('click', 'tr', function () {

        var datosFila = tablaUsuarios.row(this).data();
        var indiceFila = tablaUsuarios.row(this).index();

        $('#eliminarUsuario').data(datosFila);
        $('#registrarPago').data(datosFila);
        $('#agregarUsuario').data(datosFila);


    });

    $("#btnEliminarUsuario").click(async function () {

        let datos = $('#eliminarUsuario').data();

        const delDesc = await asyncPostAjax('/usuarios/eliminar/', { id: datos.id });

        if (delDesc.state = 'success') {

            showNotification(delDesc.state, delDesc.message);
            resetTablaUsuarios();

        }

    });

});
