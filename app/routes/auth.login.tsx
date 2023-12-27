import { Button, Divider, Input } from '@nextui-org/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLocation,
  useNavigation
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { LoginFormData, LoginSchema } from '~/shared/schema';
import { supabaseServer } from '~/utils/supabase.server';
import StatusCodes from 'http-status-codes';
import { toast } from 'react-toastify';

export async function action({ request }: ActionFunctionArgs) {
  const { client, response } = supabaseServer(request);
  const {
    errors,
    data,
    receivedValues: defaultValues
  } = await getValidatedFormData<LoginFormData>(
    request,
    LoginSchema.resolver()
  );

  if (errors) {
    return json(
      {
        errors
      },
      { status: StatusCodes.BAD_REQUEST, headers: response.headers }
    );
  }

  const {
    data: { user },
    error
  } = await client.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (!user || error) {
    return json(
      {
        errors: {
          auth: error?.message
        }
      },
      { status: StatusCodes.BAD_REQUEST, headers: response.headers }
    );
  }
  return redirect('/dashboard');
}

export default function Login() {
  const { pathname } = useLocation();
  let data = useActionData<typeof action>();
  const { state } = useNavigation();
  const [hasAuthError, toggleErrorState] = useState<boolean>(false);

  const { handleSubmit, formState, register, reset } =
    useRemixForm<LoginFormData>({
      resolver: LoginSchema.resolver(),
      defaultValues: {
        email: '',
        password: ''
      }
    });

  useEffect(() => {
    if (state === 'idle' && data?.errors.auth) {
      toast.error(data?.errors?.auth as string, {
        progress: undefined,
        hideProgressBar: true
      });
      toggleErrorState(true);
      reset();
    }
  }, [state]);

  return (
    <Form
      className="flex gap-4 flex-col justify-center h-full"
      onSubmit={handleSubmit}
      method="POST"
    >
      <Input
        {...register('email', {
          onChange() {
            toggleErrorState(false);
          }
        })}
        variant="bordered"
        size="sm"
        type="email"
        label="Email"
        isInvalid={hasAuthError}
        required
        isRequired
      />
      <Input
        {...register('password', {
          onChange() {
            toggleErrorState(false);
          }
        })}
        variant="bordered"
        required
        isRequired
        size="sm"
        isInvalid={hasAuthError}
        errorMessage={hasAuthError && (data?.errors?.auth as string)}
        type="password"
        label="Password"
      />

      <Divider />
      <Button
        color="primary"
        variant={formState.isValid && !data?.errors.auth ? 'bordered' : 'faded'}
        type="submit"
        isDisabled={!formState.isValid}
        disabled={!formState.isValid}
      >
        Sign In
      </Button>
    </Form>
  );
}
