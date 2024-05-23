# Copyright (c) 2024, slnee and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _	
from frappe.utils.password import get_decrypted_password, check_password, set_encrypted_password, update_password



def send_rejection_email(email, rejection_reason):
		# Envoyer un e-mail au livreur avec la raison du rejet
		subject = "Application Rejected"
		message = f"Dear Company,\n\nWe regret to inform you that your application has been rejected. Reason: {rejection_reason}"
		frappe.sendmail(recipients=[email], subject=subject, message=message)


class DeliveryRegistration(Document):
	# pass
	
	# def before_save(self):
	# 	self.full_name = f"{self.first_name} {self.last_name}"

	@frappe.whitelist()
	def accept_delivery_registration(self, docname):
		try:
			# Récupérer les données de la demande
			registration_doc = frappe.get_doc("Delivery Registration", docname)

			if registration_doc.status == "Accepted":
				frappe.msgprint(_("The delivery's application has already been accepted."))
				return

			else:	
				# Créer une nouvelle delivery
				new_delivery = frappe.get_doc({
					'doctype': 'Deliveryman',
					'first_name': registration_doc.first_name,
					'last_name': registration_doc.last_name,
					'full_name': registration_doc.full_name,
					'birthday': registration_doc.birthday,
					'contact_number': registration_doc.contact_number,
					'email': registration_doc.email,
					'city': registration_doc.city,
					'driving_license': registration_doc.driving_license,
					'traffic_licence': registration_doc.traffic_licence
					
				})
				new_delivery.insert(ignore_permissions=True)
				
				# Créer un nouvel utilisateur avec le role "delivery"
				new_user = frappe.get_doc({
					'doctype': 'User',
					'first_name': registration_doc.first_name,
					'last_name': registration_doc.last_name,
					'username': registration_doc.full_name,
					'email': registration_doc.email,
					'send_welcome_email': 1,
					# 'new_password': registration_doc.confirm_password
					# 'password': registration_doc.password
					# 'password': frappe.generate_hash(registration_doc.password)
					# Ajoutez d'autres champs nécessaires pour créer un utilisateur
				})
				new_user.append('roles', {'role': 'Deliveryman'})
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
	def reject_delivery_registration(self, docname, rejection_reason):
		try:
			# Récupérer les données de la demande
			registration_doc = frappe.get_doc("Delivery Registration", docname)

			# Vérifier si la demande a déjà été rejetée
			if registration_doc.status == "Rejected":
				frappe.msgprint(_("The delivery's application has already been rejected."))
				return

			# Vérifier si le livreur et l'User existent avant de les supprimer
			if frappe.db.exists("Deliveryman", registration_doc.full_name) and frappe.db.exists("User", registration_doc.email):
				# Supprimer l'utilisateur
				frappe.delete_doc("User", registration_doc.email)
				
				# Supprimer le livreur 	
				frappe.delete_doc("Deliveryman", registration_doc.full_name)

				# Mettre à jour le statut de la demande
				registration_doc.status = "Rejected"
				registration_doc.save()

				frappe.msgprint(_("User and delivery successfully deleted."))
				
			# Send email to the deliveryman with the rejection reason
			send_rejection_email(registration_doc.email, rejection_reason)

			registration_doc.status = "Rejected"
			registration_doc.save()
			frappe.msgprint(_('Application successfully refused.'))
		except Exception as e:
			frappe.log_error(e)
			frappe.msgprint(_('Error in refusal of application.'))

