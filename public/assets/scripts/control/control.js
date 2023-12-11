
const action_iconsNP = `<div class="d-flex order-actions buttonsActions" bis_skin_checked="1">	
                            <a id="btnModificarUsuario"><i class="material-icons-two-tone">edit</i></a>
                            <a data-bs-toggle="modal" data-bs-target="#registrarPago"><i class="material-icons-two-tone">payments</i></a>
                            <a href="/usuarios"><i class="material-icons-two-tone">fingerprint</i></a>
                            <a data-bs-toggle="modal" data-bs-target="#eliminarUsuario"><i class="material-icons-two-tone">delete</i></a>
                        </div>`;


$(document).ready(function () {


    var gastosTable = $('#gastosTable').DataTable({
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



})