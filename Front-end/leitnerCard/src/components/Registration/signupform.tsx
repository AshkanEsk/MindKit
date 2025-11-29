import { Form, FormGroup, FormControl, Button, FormLabel, Row, Col } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import ModalComponent from '../Profile/Modal';
import EmailConfirmation from './EmailConfirmation';
import * as motion from "motion/react-client";
import { useState } from 'react';

interface IFormInput {
  username: string;
  email: string;
  full_name?: string;
  phone_no?: string;
  profile_image: FileList;
  password: string;
  confirmPassword: string;
  gender: string;
}

interface ButtonInput {
  Rotate: () => void;
}

export default function SignUpForm({ Rotate }: ButtonInput) {
  const { register, watch, formState: { errors } } = useForm<IFormInput>();
  const [newUser, setNewUser] = useState<Partial<IFormInput>>({
    username: '',
    email: '',
    password: '',
    gender: 'M',
    full_name: '',
    phone_no: '',
  });

  const password = watch("password");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.5,
            scale: { type: "spring", visualDuration: 1, bounce: 0.3 },
        }}
    >
      <Form 
        className="p-4 shadow rounded"
        style={{ 
          background: 'linear-gradient(45deg, rgb(237, 251, 35) 0%, rgb(238, 255, 0) 40%)',
          minWidth: '400px',
          minHeight:'650px',
        }}
        >
        <h2 className="text-primary mb-4">Sign Up</h2>

        <FormGroup controlId="formUsername" className='m-2'>
          <FormLabel>Username</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter username"
            {...register('username', { required: 'Username is required' })}
            aria-invalid={errors.username ? 'true' : 'false'}
            className="border-secondary"
            onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
          />
          {errors.username && <span className="text-danger">{errors.username.message}</span>}
        </FormGroup>

        <FormGroup controlId="formEmail" className='m-2'>
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type="email"
            placeholder="Enter email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
            className="border-secondary"
            onChange={(e) => {
              setNewUser((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </FormGroup>

        <Row>
          <Col md={6}>
            <FormGroup controlId="formPhoneNumber" className='my-2 ms-2'>
              <FormLabel>Phone Number</FormLabel>
              <FormControl
                type="tel"
                placeholder="Enter phone number"
                {...register('phone_no', {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Enter a valid phone number'
                  }
                })}
                aria-invalid={errors.phone_no ? 'true' : 'false'}
                className="border-secondary"
                onChange={(e) => setNewUser((prev) => ({ ...prev, phone_no: e.target.value }))}
              />
              {errors.phone_no && <span className="text-danger">{errors.phone_no.message}</span>}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formFullName" className='my-2 me-2'>
              <FormLabel>Full Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter full name"
                {...register('full_name')}
                className="border-secondary"
                onChange={(e) => setNewUser((prev) => ({ ...prev, full_name: e.target.value }))}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup controlId="formPassword" className='my-2 ms-2'>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Enter password"
                {...register('password', { required: 'Password is required' })}
                aria-invalid={errors.password ? 'true' : 'false'}
                className="border-secondary"
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
              />
              {errors.password && <span className="text-danger">{errors.password.message}</span>}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formConfirmPassword" className='my-2 me-2'>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl
                type="password"
                placeholder="Confirm password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: value =>
                    value === password || 'The passwords do not match'
                })}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                className="border-secondary"
                onChange={(e) => setNewUser((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
              {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup controlId="formGender" className='my-2 ms-2'>
              <FormLabel>Gender</FormLabel>
              <Form.Select 
                {...register('gender')}
                aria-label="Select gender" 
                className="border-secondary"
                onChange={(e) => setNewUser((prev) => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Form.Select>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="formProfileImage" className='my-2 me-2'>
              <FormLabel>Profile Image</FormLabel>
              <FormControl
                type="file"
                {...register('profile_image')}
                aria-invalid={errors.profile_image ? 'true' : 'false'}
                className="border-secondary"
              />
              {errors.profile_image && <span className="text-danger">{errors.profile_image.message}</span>}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex justify-content-center mt-3">
            <Button
              className='w-100'
              variant="outline-secondary"
              onClick={Rotate}
            >
              Sign In
            </Button>
            <ModalComponent 
              launchButtonText='Submit'
              launchButtonStyle='mx-2 px-5'
              modalHeadingText='Email Confirmation'
            >
              {newUser.username && newUser.email && newUser.password ? (
                <EmailConfirmation user={newUser} />
              ) : (
                <div className="text-danger">Please complete the form</div>
              )}
            </ModalComponent>
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
}
