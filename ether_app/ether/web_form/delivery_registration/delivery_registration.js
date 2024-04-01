frappe.ready(function() {

    // document.querySelector('.page-header').innerHTML = `
    // <h1 class='text-danger'> hmema application </h1>`;


    // Écoutez les changements dans les champs first_name et last_name
    frappe.web_form.on('first_name', () => {
        updateFullName(); // Appel de la fonction pour mettre à jour le nom complet
    });

    frappe.web_form.on('last_name', () => {
        updateFullName(); // Appel de la fonction pour mettre à jour le nom complet
    });

    frappe.web_form.after_load = () => {
        // frappe.msgprint('salemo alikom');
        updateFullName(); // Appel de la fonction pour mettre à jour le nom complet après le chargement du formulaire
        // console.log("hmem is here");
    };

    frappe.web_form.validate = () => {
        var email_id = frappe.web_form.get_value("email");
        var passwordVal = frappe.web_form.get_value("password");
        var confirmPasswordVal = frappe.web_form.get_value("confirm_password");
        
        // Vérification de l'e-mail
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!mailformat.test(email_id) && email_id) {
            frappe.msgprint(__("Enter a valid email address"));
            return false;
        }
        
        // Vérification que les champs "Password" et "Confirm password" correspondent
        if (passwordVal !== confirmPasswordVal) {
            frappe.msgprint(__("The 'Password' and 'Confirm password' fields must match."));
            return false; 
        }
    
        return true;
    };
});

function updateFullName() {
    // Récupérer les valeurs des champs first_name et last_name
    var first_name = frappe.web_form.get_value('first_name') || '';
    var last_name = frappe.web_form.get_value('last_name') || '';

    // Concaténer les valeurs pour former le nom complet
    var full_name = first_name + ' ' + last_name;

    // Définir la valeur de full_name avec le nom complet calculé
    frappe.web_form.set_value('full_name', full_name);
}
