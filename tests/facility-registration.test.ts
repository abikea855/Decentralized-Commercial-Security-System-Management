import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity environment
const mockClarity = {
  contracts: {
    facilityRegistration: {
      registerFacility: vi.fn(),
      updateFacility: vi.fn(),
      deactivateFacility: vi.fn(),
      reactivateFacility: vi.fn(),
      getFacility: vi.fn(),
      isFacilityOwner: vi.fn(),
      getFacilityCount: vi.fn(),
    },
  },
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  },
  block: {
    time: 1234567890,
  },
}

// Reset mocks before each test
beforeEach(() => {
  vi.resetAllMocks()
  
  // Setup default mock responses
  mockClarity.contracts.facilityRegistration.registerFacility.mockReturnValue({ value: 1 })
  mockClarity.contracts.facilityRegistration.getFacility.mockReturnValue({
    value: {
      name: "Test Facility",
      address: "123 Test St",
      contactName: "John Doe",
      contactPhone: "555-1234",
      registrationDate: 1234567890,
      active: true,
    },
  })
  mockClarity.contracts.facilityRegistration.isFacilityOwner.mockReturnValue({ value: true })
  mockClarity.contracts.facilityRegistration.getFacilityCount.mockReturnValue({ value: 1 })
})

describe("Facility Registration Contract", () => {
  it("should register a new facility", async () => {
    const result = await mockClarity.contracts.facilityRegistration.registerFacility(
        "Test Facility",
        "123 Test St",
        "John Doe",
        "555-1234",
    )
    
    expect(result.value).toBe(1)
    expect(mockClarity.contracts.facilityRegistration.registerFacility).toHaveBeenCalledWith(
        "Test Facility",
        "123 Test St",
        "John Doe",
        "555-1234",
    )
  })
  
  it("should get facility details", async () => {
    const result = await mockClarity.contracts.facilityRegistration.getFacility(1)
    
    expect(result.value).toEqual({
      name: "Test Facility",
      address: "123 Test St",
      contactName: "John Doe",
      contactPhone: "555-1234",
      registrationDate: 1234567890,
      active: true,
    })
    expect(mockClarity.contracts.facilityRegistration.getFacility).toHaveBeenCalledWith(1)
  })
  
  it("should verify facility ownership", async () => {
    const result = await mockClarity.contracts.facilityRegistration.isFacilityOwner(
        1,
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    )
    
    expect(result.value).toBe(true)
    expect(mockClarity.contracts.facilityRegistration.isFacilityOwner).toHaveBeenCalledWith(
        1,
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    )
  })
  
  it("should update facility information", async () => {
    mockClarity.contracts.facilityRegistration.updateFacility.mockReturnValue({ value: true })
    
    const result = await mockClarity.contracts.facilityRegistration.updateFacility(
        1,
        "Updated Facility",
        "456 New St",
        "Jane Smith",
        "555-5678",
    )
    
    expect(result.value).toBe(true)
    expect(mockClarity.contracts.facilityRegistration.updateFacility).toHaveBeenCalledWith(
        1,
        "Updated Facility",
        "456 New St",
        "Jane Smith",
        "555-5678",
    )
  })
  
  it("should deactivate a facility", async () => {
    mockClarity.contracts.facilityRegistration.deactivateFacility.mockReturnValue({ value: true })
    
    const result = await mockClarity.contracts.facilityRegistration.deactivateFacility(1)
    
    expect(result.value).toBe(true)
    expect(mockClarity.contracts.facilityRegistration.deactivateFacility).toHaveBeenCalledWith(1)
  })
  
  it("should reactivate a facility", async () => {
    mockClarity.contracts.facilityRegistration.reactivateFacility.mockReturnValue({ value: true })
    
    const result = await mockClarity.contracts.facilityRegistration.reactivateFacility(1)
    
    expect(result.value).toBe(true)
    expect(mockClarity.contracts.facilityRegistration.reactivateFacility).toHaveBeenCalledWith(1)
  })
  
  it("should get the total facility count", async () => {
    const result = await mockClarity.contracts.facilityRegistration.getFacilityCount()
    
    expect(result.value).toBe(1)
    expect(mockClarity.contracts.facilityRegistration.getFacilityCount).toHaveBeenCalled()
  })
})
