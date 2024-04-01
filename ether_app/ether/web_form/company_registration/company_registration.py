import frappe
from frappe.utils import random_string

def get_context(context):
	# do your magic here
	pass

@frappe.whitelist()
def send_verification_email(self, email, verification_code):
    try:
        # Créer et envoyer l'e-mail de vérification
        subject = _("Code de vérification pour votre inscription")
        message = _("Votre code de vérification est : {0}").format(verification_code)
        frappe.sendmail(recipients=email, subject=subject, message=message)
        return "success"
    except Exception as e:
        frappe.log_error(e)
        return "error"

# def generate_verification_code():
#     return random_string(6)

# @frappe.whitelist()
# def send_verification_email(email):
#     verification_code = generate_verification_code()
#     # Enregistrez le code de vérification associé à l'e-mail de l'utilisateur
#     frappe.db.set_value("Company Registration", {"email": email}, "verification_code", verification_code)

#     # Code pour envoyer un e-mail avec le code de vérification à l'utilisateur
#     # Utilisez votre méthode ou service d'envoi d'e-mails préféré ici
#     # Exemple :
#     frappe.sendmail(recipients=email, subject="Code de vérification", message=f"Votre code de vérification est : {verification_code}")

# @frappe.whitelist()
# def verify_code(email, code):
#     stored_code = frappe.db.get_value("Company Registration", {"email": email}, "verification_code")
#     if stored_code == code:
#         # Le code est valide, continuez le processus d'enregistrement de la société
#         # Ajoutez ici votre logique pour enregistrer les données de l'entreprise
#         frappe.msgprint("Code de vérification valide. Enregistrement de la société en cours...")
#     else:
#         frappe.throw("Code de vérification incorrect. Veuillez réessayer.")