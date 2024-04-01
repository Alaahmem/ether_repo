frappe.ready(function() {
    // frappe.web_form.after_load = () => {  
    //     frappe.msgprint('hmem  aaaa');
    //     console.log('hmem');
    //     frappe.web_form.on(next, () => {
    //         var verification_code = generateVerificationCode();
    //         // Envoyez le code de vérification à l'e-mail de l'utilisateur
    //         sendVerificationCodeByEmail(verification_code);
    //         // Stockez le code de vérification dans la session ou le cache
    //         frappe.session.set("verification_code", verification_code);
    //     });
    // }


    frappe.web_form.after_load = () => {
        // Attachez une fonction à exécuter après le chargement du formulaire web
        console.log('Click detected!');
        // Écoutez l'événement de clic sur le bouton "Next"
        var nextButton = frappe.web_form.page.wrapper.find('.btn-next');
    
        nextButton.on('click', function() {
            // Votre code ici
            frappe.msgprint('you clicked next');
        });
    };
    
    // frappe.web_form.after_load = () => {
    //     // Attachez une fonction à exécuter après le chargement du formulaire web

    //     // Écoutez l'événement de clic sur le bouton "Next"

    //     var nextButton = frappe.web_form.page.wrapper.find('.btn-next');

    //     nextButton.on('click', function() {
    //         // Récupérez l'e-mail de l'utilisateur depuis le champ du web form
    //         frappe.msgprint('you click next test');
    //         console.log('asba');
    //         // var email = frappe.web_form.get_value('email');

    //         // // Vérifiez si l'e-mail est valide
    //         // if (email) {
    //         //     // Appelez une méthode serveur pour envoyer le code de vérification par e-mail
    //         //     frappe.call({
    //         //         method: 'send_verification_code',
    //         //         args: {
    //         //             email: email
    //         //         },
    //         //         callback: function(response) {
    //         //             if (response.message === 'success') {
    //         //                 // Le code de vérification a été envoyé avec succès
    //         //                 frappe.msgprint('Un code de vérification a été envoyé à votre adresse e-mail.');
    //         //             } else {
    //         //                 // Une erreur s'est produite lors de l'envoi du code de vérification
    //         //                 frappe.msgprint('Une erreur s\'est produite lors de l\'envoi du code de vérification.');
    //         //             }
    //         //         }
    //         //     });
    //         // } else {
    //         //     // Affichez un message si l'e-mail n'est pas valide
    //         //     frappe.msgprint('Veuillez fournir une adresse e-mail valide.');
    //         // }
    //     });
    // }

    frappe.web_form.validate = () => {
        // var email_id = frappe.web_form.get_value("email");
        var passwordVal = frappe.web_form.get_value("password");
        var confirmPasswordVal = frappe.web_form.get_value("confirm_password");
        
        // Vérification de l'e-mail
        // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // if (!mailformat.test(email_id) && email_id) {
        //     frappe.msgprint(__("Enter a valid email address"));
        //     return false;
        // }
        
        // Vérification que les champs "Password" et "Confirm password" correspondent
        if (passwordVal !== confirmPasswordVal) {
            frappe.msgprint(__("The 'Password' and 'Confirm password' fields must match."));
            return false; 
        }
    
        return true;
    };
})


function generateVerificationCode() {
    // Implémentez votre logique pour générer le code de confirmation
    // Par exemple, vous pouvez générer un code aléatoire de 6 chiffres
    return Math.floor(100000 + Math.random() * 900000);
}

function sendVerificationCodeByEmail(verification_code) {
    var email = frappe.web_form.get_value("email"); // Récupérer l'e-mail de l'utilisateur depuis le web form
    if (email) {
        // Appeler une méthode serveur pour envoyer l'e-mail avec le code de vérification
        frm.call({
            doc: frm.doc,
            method: 'send_verification_email',
            args: {
                email: email,
                verification_code: verification_code
            },
            callback: function(response) {
                if (response.message === "success") {
                    frappe.msgprint("Le code de vérification a été envoyé à votre adresse e-mail.");
                } else {
                    frappe.msgprint("Une erreur s'est produite lors de l'envoi du code de vérification. Veuillez réessayer.");
                }
            }
        });
    } else {
        frappe.msgprint("Veuillez fournir une adresse e-mail valide.");
    }
}