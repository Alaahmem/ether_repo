// Copyright (c) 2024, slnee and contributors
// For license information, please see license.txt

frappe.ui.form.on('Delivery Registration', {
	// refresh: function(frm) {

	// }
    first_name: function(frm) {
        // Mettre à jour le champ full_name
        updateFullName(frm);
    },
    last_name: function(frm) {
        // Mettre à jour le champ full_name
        updateFullName(frm);
    },

	validate: function(frm) {
        // Récupérer les valeurs des champs
        var password = frm.doc.password;
        var confirmPassword = frm.doc.confirm_password;

        // Vérifier si les champs correspondent
        if (password !== confirmPassword) {
            frappe.msgprint(__("The 'Password' and 'Confirm password' fields must match."));
            frappe.validated = false;
        }
    },
	refresh: function(frm) {
        if (frappe.user.has_role('Super Admin') && !frappe.user.has_role('Administrator')){
            frm.page.set_primary_action(__('Save'), function() {
                frm.save();
            }).addClass('hide');
        }

        if (frappe.user.has_role('Super Admin')){
            frm.add_custom_button(__('Accept'), function(){
                // frappe.msgprint(frm.doc.email);
                // frappe.msgprint("demande accepter");
                frm.call({
                    doc: frm.doc,
                    method: 'accept_delivery_registration',
                    args: { docname: frm.doc.name },
                    freeze: true,
                    freeze_message: ("Please wait..."), 
                    callback: function(response) {
                        if (response.message) {
                            frappe.msgprint(response.message);
                            frm.reload_doc();
                        }
                    }
                });
            }).css({'background-color': '#28a745', 'border-color': '#28a745', 'color': '#fff'}).hover(function(){
              // Fonction appelée lorsqu'on survole le bouton
                $(this).css({'background-color': '#218838', 'border-color': '#218838', 'color': '#fff'});
                }, function(){
              // Fonction appelée lorsque le survol se termine
                $(this).css({'background-color': '#28a745', 'border-color': '#28a745', 'color': '#fff'});
            });
            frm.add_custom_button(__('Reject'), function(){
                // frappe.msgprint(frm.doc.email);
                // frappe.msgprint("demande refuser");
                frm.call({
                    doc: frm.doc,
                    method: 'reject_delivery_registration',
                    args: { docname: frm.doc.name },
                    freeze: true,
                    freeze_message: ("Please wait..."),
                    callback: function(response) {
                        if (response.message) {
                            frappe.msgprint(response.message);
                            frm.reload_doc();
                        }
                    }
                });
                // frm.call({
                //     doc: frm.doc,
                //     method: 'remove_delivery_and_user',
                //     args: { docname: frm.doc.name },
                //     freeze: true,
                //     freeze_message: ("Please wait..."),
                //     callback: function(response) {
                //         if (response.message) {
                //             frappe.msgprint(response.message);
                //             frm.reload_doc();
                //         }
                //     }
                // });
            }).css({'background-color': '#dc3545', 'border-color': '#dc3545', 'color': '#fff'}).hover(function(){
              // Fonction appelée lorsqu'on survole le bouton
                $(this).css({'background-color': '#c82333', 'border-color': '#c82333', 'color': '#fff'});
                }, function(){
              // Fonction appelée lorsque le survol se termine
            $(this).css({'background-color': '#dc3545', 'border-color': '#dc3545', 'color': '#fff'});
            });
        }
		
	},

});

function updateFullName(frm) {
    var first_name = frm.doc.first_name || '';
    var last_name = frm.doc.last_name || '';
    var full_name = first_name + ' ' + last_name;
    frm.set_value('full_name', full_name);
}
