// Copyright (c) 2024, slnee and contributors
// For license information, please see license.txt


frappe.ui.form.on('company registration', {
	// refresh: function(frm) {
	// 		frappe.msgprint(__("hello world from 'refrech' event"))
	// 	}
    
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
                    method: 'accept_company_registration',
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
                if (frm.doc.status === "Rejected") {
                    frappe.msgprint("The company's application has already been rejected.");
                    return;
                }
                frappe.prompt({
                    "fieldname": "reason_for_rejection",
                    "label": "Reason for Rejection",
                    "fieldtype": "Small Text",
                    "reqd": 1
                }, function(values) {
                    console.log(values); // Afficher les valeurs saisies dans la console
                    var rejection_reason = values.reason_for_rejection;
                    if (!rejection_reason) {
                        frappe.msgprint("Please enter a reason for rejection.");
                        return;
                    }
                
                    // Call the server method to reject the company registration
                    frm.call({
                        doc: frm.doc,
                        method: 'reject_company_registration',
                        args: {
                            docname: frm.doc.name,
                            rejection_reason: rejection_reason
                        },
                        freeze: true,
                        freeze_message: "Please wait...",
                        callback: function(response) {
                            if (response.message) {
                                frappe.msgprint(response.message);
                                frm.reload_doc();
                            }
                        }
                    });
                });
            }).css({'background-color': '#dc3545', 'border-color': '#dc3545', 'color': '#fff'}).hover(function(){
                // Function called when hovering over the button
                $(this).css({'background-color': '#c82333', 'border-color': '#c82333', 'color': '#fff'});
            }, function(){
                // Function called when hover ends
                $(this).css({'background-color': '#dc3545', 'border-color': '#dc3545', 'color': '#fff'});
            });
        }
		
	},
    
	validate: function(frm) {
        // Récupérer les valeurs des champs
        var password = frm.doc.password;
        var confirmPassword = frm.doc.confirm_password;
        
        // Vérifier si les champs correspondent
        if (password !== confirmPassword) {
            frappe.msgprint(__("The 'Password' and 'Confirm password' fields must match."));
            frappe.validated = false;
            return;
        }
        
        // Vérifier la longueur du mot de passe
        if (password.length < 8) {
            frappe.msgprint(__("Le mot de passe doit contenir au moins 8 caractères."));
            frappe.validated = false;
            return;
        }
        
        // Vérifier la présence de caractères spéciaux
        var specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialChars.test(password)) {
            frappe.msgprint(__("Le mot de passe doit contenir au moins un caractère spécial."));
            frappe.validated = false;
            return;
        }
        
        // Vérifier la présence de lettres majuscules
        var upperCaseChars = /[A-Z]/;
        if (!upperCaseChars.test(password)) {
            frappe.msgprint(__("Le mot de passe doit contenir au moins une lettre majuscule."));
            frappe.validated = false;
            return;
        }
        
        // Vérifier la présence de chiffres
        var numbers = /[0-9]/;
        if (!numbers.test(password)) {
            frappe.msgprint(__("Le mot de passe doit contenir au moins un chiffre."));
            frappe.validated = false;
            return;
        }
    }

});
