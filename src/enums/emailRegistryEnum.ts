export enum EmailRegistryStatusEnum {
  sanitized = "sanitized",
  unsanitized = "unsanitized",
  inprogress = 'inprogress'
}

export enum EmailRegistrySanitizedStatusEnum {
  deliverable = "deliverable",
  risky = "risky",
  undeliverable = "undeliverable",
  unknown = "unknown",
}

export enum EmailRegistrySanitizedReasonEnum {
  accepted_email = "accepted_email",
  low_deliverability = "low_deliverability",
  low_quality = "low_quality",
  invalid_email = "invalid_email",
  invalid_domain = "invalid_domain",
  rejected_email = "rejected_email",
  dns_error = "dns_error",
  unavailable_smtp = "unavailable_smtp",
  unknown = "unknown",
}
