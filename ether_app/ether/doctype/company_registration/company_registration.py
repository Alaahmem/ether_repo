# Copyright (c) 2024, slnee and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _	
# from frappe.utils.password import get_random_password
# from frappe.utils.password import generate_hash
from frappe.utils.password import get_decrypted_password, check_password, set_encrypted_password, update_password
# from frappe.utils.password import validate_password


class companyregistration(Document):
	@frappe.whitelist()
	def accept_company_registration(self, docname):
		try:
			# Récupérer les données de la demande
			registration_doc = frappe.get_doc("company registration", docname)

			if registration_doc.status == "Accepted":
				frappe.msgprint(_("The company's application has already been accepted."))
				return

			else:	
				# Créer une nouvelle Company
				new_company = frappe.get_doc({
					'doctype': 'Company',
					'company_name': registration_doc.company_name,
					'abbr': registration_doc.company_name,
					'default_currency': registration_doc.currency,
					'country': registration_doc.country
					# Ajoutez d'autres champs nécessaires pour créer une Company
				})
				new_company.insert(ignore_permissions=True)
				
				# Créer un nouvel utilisateur avec le role "Company"
				new_user = frappe.get_doc({
					'doctype': 'User',
					'first_name': registration_doc.company_name,
					'email': registration_doc.email,
					'send_welcome_email': 1,
					# 'new_password': registration_doc.confirm_password
					# 'password': registration_doc.password
					# 'password': frappe.generate_hash(registration_doc.password)
					# Ajoutez d'autres champs nécessaires pour créer un utilisateur
				})
				new_user.append('roles', {'role': 'Company'})
				new_user.insert(ignore_permissions=True)

				new_user.new_password = registration_doc.get_password("password")
				# new_user.new_password = get_decrypted_password(registration_doc.name, registration_doc.password)

				new_user.save()
				registration_doc.status = "Accepted"
				registration_doc.save()
				frappe.msgprint(_('Successful application.'))

				
				# update_password(new_user.first_name, registration_doc.password)
				# frappe.msgprint(new_user.new_password)
				# Mettre à jour le statut de la demande
				# frappe.msgprint(frappe.generate_hash(registration_doc.password))

				# new_user.set_password(frappe.generate_hash(registration_doc.password))
				# return _('Demande acceptée avec succès.')
		# except Exception as e:
		# 	frappe.log_error(e)
		# 	return _('Error accepting request.')
		
		except Exception as e:
			frappe.log_error(e)
			print(f"Error accepting request: {e}") 
			frappe.msgprint(e)
			return _('Error accepting request.')

	@frappe.whitelist()
	def reject_company_registration(self, docname):
		try:
			# Récupérer les données de la demande
			registration_doc = frappe.get_doc("company registration", docname)

			# Vérifier si la demande a déjà été rejetée
			if registration_doc.status == "Rejected":
				frappe.msgprint(_("The company's application has already been rejected."))
				return

			# Vérifier si la Company et l'User existent avant de les supprimer
			if frappe.db.exists("Company", registration_doc.company_name) and frappe.db.exists("User", registration_doc.email):
				# Supprimer l'utilisateur
				frappe.delete_doc("User", registration_doc.email)
				
				# Supprimer la société
				frappe.delete_doc("Company", registration_doc.company_name)

				# Mettre à jour le statut de la demande
				registration_doc.status = "Rejected"
				registration_doc.save()

				frappe.msgprint(_("User and company successfully deleted."))
				return

			# Si la Company ou l'User n'existent pas, mettre à jour le statut de la demande
			registration_doc.status = "Rejected"
			registration_doc.save()

			frappe.msgprint(_('Application successfully refused.'))
		except Exception as e:
			frappe.log_error(e)
			frappe.msgprint(_('Error in refusal of application.'))


	# def on_update(self):
	# 	frappe.msgprint('before submit test')
	# 	saved_verification_code = frappe.session.get("verification_code")
	# 	user_verification_code = self.verification_code

	# 	if saved_verification_code != user_verification_code:
	# 		# Les codes de confirmation correspondent, vous pouvez maintenant valider et soumettre le document
	# 		pass
	# 	else:
	# 		# Les codes de confirmation ne correspondent pas, vous pouvez annuler la soumission du document et afficher un message d'erreur
	# 		frappe.throw("Le code de confirmation est incorrect. Veuillez réessayer.") 






	# @frappe.whitelist()	
	# def remove_company_and_user(self, docname):
	# 	# Logique pour supprimer l'utilisateur et la société
	# 	try:
	# 		# Récupérer les données de la demande
	# 		registration_doc = frappe.get_doc("company registration", docname)

	# 		# Supprimer la société
	# 		if frappe.db.exists("Company", registration_doc.company_name):
	# 			frappe.delete_doc("Company", registration_doc.company_name)
	# 		else:
	# 			return _("company dose note exist")
	# 		# Supprimer l'utilisateur
	# 		if frappe.db.exists("User", registration_doc.email):
	# 			frappe.delete_doc("User", registration_doc.email)
	# 		else:
	# 			frappe.msgprint(_("user dose note exist"))

	# 		return _("Utilisateur et société supprimés avec succès.")

	# 	except Exception as e:
	# 		frappe.log_error(e)
	# 		return _("Erreur lors de la suppression de l'utilisateur et de la société.")
