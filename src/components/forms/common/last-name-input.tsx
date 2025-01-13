interface LastNameInputProps {
  lastName: string
  setLastName: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean // Add the disabled prop
}

const LastNameInput: React.FC<LastNameInputProps> = ({ lastName, setLastName, disabled }) => (
  <div className="space-y-2">
    <label htmlFor="lastName" className="text-sm font-medium leading-none">
      Last Name
    </label>
    <input
      id="lastName"
      type="text"
      placeholder="Last Name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      disabled={disabled} // Apply the disabled prop
      className={`w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
)

export default LastNameInput
