interface TextInputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TextInput({
    placeholder,
    value,
    onChange,
    onKeyDown
}: TextInputProps){
    return <input 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid black',
            width: '100%',
        }} 
    />;
}