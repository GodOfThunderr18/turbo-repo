interface TextInputProps {
    placeholder: string;
    
}

export function TextInput({
    placeholder
}: TextInputProps){
    return <input placeholder={placeholder} style={{
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid black',
    }} />;
}