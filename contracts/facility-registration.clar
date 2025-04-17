;; Facility Registration Contract
;; Records details of protected properties

(define-data-var last-facility-id uint u0)

(define-map facilities
  { facility-id: uint }
  {
    name: (string-utf8 100),
    address: (string-utf8 200),
    contact-name: (string-utf8 100),
    contact-phone: (string-utf8 20),
    registration-date: uint,
    active: bool
  }
)

(define-map facility-owners
  { facility-id: uint }
  { owner: principal }
)

;; Register a new facility
(define-public (register-facility
    (name (string-utf8 100))
    (address (string-utf8 200))
    (contact-name (string-utf8 100))
    (contact-phone (string-utf8 20)))
  (let
    (
      (new-id (+ (var-get last-facility-id) u1))
    )
    (var-set last-facility-id new-id)
    (map-set facilities
      { facility-id: new-id }
      {
        name: name,
        address: address,
        contact-name: contact-name,
        contact-phone: contact-phone,
        registration-date: (unwrap-panic (get-block-info? time u0)),
        active: true
      }
    )
    (map-set facility-owners
      { facility-id: new-id }
      { owner: tx-sender }
    )
    (ok new-id)
  )
)

;; Update facility information
(define-public (update-facility
    (facility-id uint)
    (name (string-utf8 100))
    (address (string-utf8 200))
    (contact-name (string-utf8 100))
    (contact-phone (string-utf8 20)))
  (let
    (
      (facility-data (unwrap! (map-get? facilities { facility-id: facility-id }) (err u1)))
      (owner-data (unwrap! (map-get? facility-owners { facility-id: facility-id }) (err u2)))
    )
    ;; Check if sender is the owner
    (asserts! (is-eq tx-sender (get owner owner-data)) (err u3))

    (map-set facilities
      { facility-id: facility-id }
      (merge facility-data
        {
          name: name,
          address: address,
          contact-name: contact-name,
          contact-phone: contact-phone
        }
      )
    )
    (ok true)
  )
)

;; Deactivate a facility
(define-public (deactivate-facility (facility-id uint))
  (let
    (
      (facility-data (unwrap! (map-get? facilities { facility-id: facility-id }) (err u1)))
      (owner-data (unwrap! (map-get? facility-owners { facility-id: facility-id }) (err u2)))
    )
    ;; Check if sender is the owner
    (asserts! (is-eq tx-sender (get owner owner-data)) (err u3))

    (map-set facilities
      { facility-id: facility-id }
      (merge facility-data { active: false })
    )
    (ok true)
  )
)

;; Reactivate a facility
(define-public (reactivate-facility (facility-id uint))
  (let
    (
      (facility-data (unwrap! (map-get? facilities { facility-id: facility-id }) (err u1)))
      (owner-data (unwrap! (map-get? facility-owners { facility-id: facility-id }) (err u2)))
    )
    ;; Check if sender is the owner
    (asserts! (is-eq tx-sender (get owner owner-data)) (err u3))

    (map-set facilities
      { facility-id: facility-id }
      (merge facility-data { active: true })
    )
    (ok true)
  )
)

;; Read-only function to get facility details
(define-read-only (get-facility (facility-id uint))
  (map-get? facilities { facility-id: facility-id })
)

;; Read-only function to check if caller is facility owner
(define-read-only (is-facility-owner (facility-id uint) (caller principal))
  (let
    (
      (owner-data (map-get? facility-owners { facility-id: facility-id }))
    )
    (and
      (is-some owner-data)
      (is-eq caller (get owner (unwrap! owner-data false)))
    )
  )
)

;; Read-only function to get total number of facilities
(define-read-only (get-facility-count)
  (var-get last-facility-id)
)
