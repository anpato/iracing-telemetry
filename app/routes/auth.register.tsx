import { Input, Divider, Button } from '@nextui-org/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import {
  useLocation,
  useActionData,
  useNavigation,
  Form
} from '@remix-run/react';
import { StatusCodes } from 'http-status-codes';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { RegisterFormData, RegisterSchema } from '~/shared/schema';
import { supabaseServer } from '~/utils/supabase.server';

export async function action({ request }: ActionFunctionArgs) {
  const { client, response } = supabaseServer(request);
  const {
    errors,
    data,
    receivedValues: defaultValues
  } = await getValidatedFormData<RegisterFormData>(
    request,
    RegisterSchema.resolver()
  );

  if (errors || data.password !== data.confirmPassword) {
    return json(
      {
        errors: {
          auth: '',
          password: 'Passwords do not match'
        }
      },
      { status: StatusCodes.BAD_REQUEST, headers: response.headers }
    );
  }

  const {
    data: { user },
    error
  } = await client.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (!user || error) {
    return json(
      {
        errors: {
          auth: error?.message,
          password: ''
        }
      },
      { status: StatusCodes.BAD_REQUEST, headers: response.headers }
    );
  }
  // TODO handle this error gracefully
  await client.from('user_infos').insert({ user_id: user.id });

  return redirect('/auth/login');
}

export default function Register() {
  const { pathname } = useLocation();
  let data = useActionData<typeof action>();
  const { state } = useNavigation();
  const [hasAuthError, toggleErrorState] = useState<boolean>(false);

  const { handleSubmit, formState, register, reset, watch } =
    useRemixForm<RegisterFormData>({
      resolver: RegisterSchema.resolver(),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    });

  useEffect(() => {
    if (state === 'idle' && (data?.errors.auth || data?.errors.password)) {
      toast.error(
        data?.errors?.auth
          ? data.errors.auth
          : (data.errors.password as string),
        {
          progress: undefined,
          hideProgressBar: true
        }
      );
      toggleErrorState(true);
      reset();
    }
  }, [state]);

  return (
    <Form
      className="flex gap-2 flex-col justify-center h-full"
      onSubmit={handleSubmit}
      method="POST"
    >
      <Input
        variant="bordered"
        size="sm"
        type="email"
        label="Email"
        isInvalid={hasAuthError}
        required
        isRequired
        {...register('email', {
          onChange() {
            toggleErrorState(false);
          }
        })}
      />
      <Input
        variant="bordered"
        required
        isRequired
        size="sm"
        isInvalid={hasAuthError}
        type="password"
        label="Password"
        {...register('password', {
          onChange() {
            toggleErrorState(false);
          }
        })}
      />
      <Input
        variant="bordered"
        required
        isRequired
        size="sm"
        isInvalid={hasAuthError}
        type="password"
        label="Confirm Password"
        {...register('confirmPassword', {
          required: true,
          validate: (value: string) => {
            console.log(value);
            if (value && watch('password') !== value) {
              return 'Your passwords do not match!';
            }
          }
        })}
      />
      <Divider />
      <Button
        color="primary"
        variant={formState.isValid && !data?.errors.auth ? 'bordered' : 'faded'}
        type="submit"
        isDisabled={!formState.isValid}
        disabled={!formState.isValid}
      >
        Register
      </Button>
    </Form>
  );
}
