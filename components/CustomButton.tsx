import React from 'react';
import { Button, ButtonProps } from 'react-native';

interface CustomButtonProps extends ButtonProps {
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, ...props }) => {
  return <Button title={title} {...props} />;
};

export default CustomButton;
